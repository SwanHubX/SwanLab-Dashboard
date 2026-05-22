"""
工具函数，用于提供一些常用的工具函数，与项目本身无关，在项目任何文件中都可以使用
"""
import os

from .font import generate_color, COLOR_LIST
from .file import check_exp_name_format, check_desc_format
from .log import swanlog
from .package import get_package_version
import datetime

def utc_time() -> datetime.datetime:
    """获取当前时间(UTC时区)"""
    return datetime.datetime.now(datetime.timezone.utc)

def create_time() -> str:
    """获取当前时间的iso字符串(UTC时区)"""
    return utc_time().isoformat()


def get_swanlog_dir() -> str:
    """
    获取存放swanlog日志文件的文件夹路径
    此函数对应为SWANLAB_LOG_FOLDER全局变量，如果没有设置，默认为当前运行目录下的swanlog文件夹
    需要注意，此函数并不会保证文件夹的存在，但是会检查父文件夹是否存在以及folder是否是一个文件夹
    :raises
        :raise FileNotFoundError: folder的父目录不存在
        :raise NotADirectoryError: folder不是一个文件夹
    :return: swanlog日志文件保存的路径，返回处理后的绝对路径
    """
    folder = os.getenv("SWANLAB_LOG_DIR", None)
    if folder is None:
        folder = os.path.join(os.getcwd(), "swanlog")
    folder = os.path.abspath(folder)
    if not os.path.exists(os.path.dirname(folder)):
        raise FileNotFoundError(f"{os.path.dirname(folder)} not found")
    if not os.path.exists(folder):
        return folder
    if not os.path.isdir(folder):
        raise NotADirectoryError(f"{folder} is not a directory")
    return folder
