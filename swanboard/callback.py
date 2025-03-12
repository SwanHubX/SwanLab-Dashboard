from swankit.callback import SwanKitCallback
from swankit.callback.models import ColumnInfo
from .db.models import *
from .db import add_multi_chart, connect, NotExistedError, ExistedError, ChartTypeError
from typing import Tuple, Optional
from swanboard.utils import swanlog, get_swanlog_dir
import time
import re


class SwanBoardCallback(SwanKitCallback):
    """
    SwanBoardCallback类，swanlab本体与数据库的连接回调函数
    """

    def __init__(self):
        super(SwanBoardCallback, self).__init__()
        self.exp: Optional[Experiment] = None

    def __str__(self) -> str:
        return "SwanBoardCallback"

    def on_init(self, proj_name: str, *args, **kwargs):
        # 连接本地数据库，要求路径必须存在，但是如果数据库文件不存在，会自动创建
        connect(autocreate=True, path=get_swanlog_dir())
        # 初始化项目数据库
        Project.init(proj_name)

    def before_init_experiment(
        self,
        run_id: str,
        exp_name: str,
        description: str,
        num: int,
        colors: Tuple[str, str],
        *args,
        **kwargs,
    ):
        pattern = r"-\d+$"
        # ---------------------------------- 实验名称校验 ----------------------------------
        # 这个循环的目的是如果创建失败则等零点五秒重新生成后缀重新创建，直到创建成功
        # 搜索所有以exp_name开头的实验
        count = Experiment.filter(Experiment.name.startswith(exp_name)).count()
        while True:
            try:
                # 获得数据库实例
                self.exp = Experiment.create(
                    name=exp_name,
                    run_id=run_id,
                    description=description,
                    num=num,
                    colors=colors,
                )
                break
            except ExistedError:
                count += 1
                swanlog.debug(f"Experiment {exp_name} has existed, try another name...")
                # 以-{数字}结尾
                if bool(re.search(pattern, exp_name)):
                    arr = exp_name.split("-")
                    arr[-1] = str(count)
                    exp_name = "-".join(arr)
                else:
                    exp_name = f"{exp_name}-{count}"
                time.sleep(0.2)

    def on_log(self, *args, **kwargs):
        # 每一次log的时候检查一下数据库中的实验状态
        # 如果实验状态不为0，说明实验已经结束，不允许再次调用log方法
        # 这意味着每次log都会进行查询，比较消耗性能，后续考虑采用多进程共享内存的方式进行优化
        swanlog.debug(f"Check experiment and state...")
        try:
            exp = Experiment.get(id=self.exp.id)
        except NotExistedError:
            raise KeyboardInterrupt("The experiment has been deleted by the user")
        # 此时self.__state == 0，说明是前端主动停止的
        if exp.status != 0:
            raise KeyboardInterrupt("The experiment has been stopped by the user")

    def on_column_create(self, column_info: ColumnInfo, *args, **kwargs):

        if column_info.cls != "CUSTOM":
            return  # 屏蔽系统生成的指标
        chart_type = column_info.chart_type.value.chart_type
        # 创建Chart
        chart = Chart.create(
            column_info.key,
            experiment_id=self.exp,
            type=chart_type,
            reference=column_info.chart_reference.lower(),
        )
        # 创建命名空间，如果命名空间已经存在，会抛出ExistedError异常，捕获不处理即可
        # 需要指定sort，default命名空间的sort为0，其他命名空间的sort为None，表示默认添加到最后
        namespace = column_info.section_name
        try:
            n = Namespace.create(name=namespace, experiment_id=self.exp.id, sort=column_info.section_sort)
            swanlog.debug(f"Namespace {namespace} created, id: {n.id}")
        except ExistedError:
            n: Namespace = Namespace.get(name=namespace, experiment_id=self.exp.id)
            swanlog.debug(f"Namespace {namespace} exists, id: {n.id}")
        # 创建display，这个必然是成功的，因为display是唯一的，直接添加到最后一条即可
        Display.create(chart_id=chart.id, namespace_id=n.id)
        tag: Tag = Tag.create(
            experiment_id=self.exp.id,
            name=column_info.key,
            type=chart_type,
            folder=column_info.kid,
        )
        # 添加一条source记录
        error = None
        if column_info.error is not None:
            error = {
                "data_class": column_info.error.got,
                "excepted": column_info.error.expected,
            }
        Source.create(tag_id=tag.id, chart_id=chart.id, error=error)
        # 新建多实验对比图表数据
        try:
            add_multi_chart(tag_id=tag.id, chart_id=chart.id)
        except ChartTypeError:
            swanlog.debug("In the multi-experiment chart, the current type of tag is not as expected.")

    def on_stop(self, error: str = None, *args, **kwargs):
        # 更新数据库中的实验状态
        self.exp.update_status(-1 if error is not None else 1)
