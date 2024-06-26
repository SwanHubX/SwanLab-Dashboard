from swanboard.db import (
    Project,
    Experiment,
    Tag,
    Chart,
    Namespace,
    Source,
    Display,
)
from swanboard.db.model import SwanModel
import nanoid
from tutils import mock_project, mock_experiment
import pytest


class TestSwanModel:
    """测试各个表模型的基础父类"""

    @pytest.fixture(scope="class", autouse=True)
    def setup(self):
        """启动前创建一个项目"""
        project_id = mock_project()
        assert project_id == 1
        yield Project.filter(Project.id == project_id)

    def test_search2dict(self, setup):
        """将查询结果转换为字典"""
        res_dict = SwanModel.search2dict(setup)
        assert isinstance(res_dict, dict)

    def test_search2list(self, setup):
        """将查询结果转换为列表"""
        res_list = SwanModel.search2list(setup)
        assert isinstance(res_list, list)

    def test_json2dict(self):
        """将json字符串转换为字典"""
        res_dict = SwanModel.json2dict('{"key": "value"}')
        assert res_dict == {"key": "value"}

    def test_json2dict_with_empty(self):
        """传递参数为空字符串"""
        res_dict = SwanModel.json2dict("")
        assert res_dict == {}

    def test_dict2json(self):
        """转化字典为json字符串"""
        res_json = SwanModel.dict2json({"key": "value"})
        assert res_json == '{"key": "value"}'

    def test_dict2json_with_json(self):
        """传递参数已经是json字符串"""
        res_json = SwanModel.dict2json('{"key": "value"}')
        assert res_json == '{"key": "value"}'


class TestProject:

    def test_init(self):
        """测试初始化一个默认项目，如果项目已存在则跳过"""
        name = nanoid.generate(size=10)
        p = Project.init(name)
        project = Project.filter(Project.id == p.id).first()
        assert project.name == name
        assert project.sum == None
        assert project.charts == 0
        assert project.pinned_opened == 1
        assert project.hidden_opened == 0
        p2 = Project.init(name)
        assert p2.id == p.id

    def test_increase_sum(self):
        """测试增加项目实验数"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0
        assert project.increase_sum(project_id) == 1
        assert project.increase_sum(project_id) == 2
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 2

    def test_decrease_sum_with_zero(self):
        """测试减少项目实验数，不允许出现负数"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0
        assert project.decrease_sum(project_id) == 0
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0

    def test_decrease_sum_with_many(self):
        """正常情况下，测试减少项目实验数"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0
        assert project.increase_sum(project_id) == 1
        assert project.increase_sum(project_id) == 2
        assert project.decrease_sum(project_id) == 1
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 1

    def test_2dict(self):
        """将实例转成字典"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert isinstance(project.__dict__(), dict)


# class TestExperiment:

#     def test_create(self):
#         pass


# class TestTag:

#     def test_create(self):
#         pass


# class TestChart:

#     def test_create(self):
#         pass


# class TestNamespace:

#     def test_create(self):
#         pass


# class TestSource:

#     def test_create(self):
#         pass


# class TestDisplay:

#     def test_create(self):
#         pass
