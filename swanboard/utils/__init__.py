"""
工具函数，用于提供一些常用的工具函数，与项目本身无关，在项目任何文件中都可以使用
"""

from .font import generate_color, FONT, COLOR_LIST
from .file import check_exp_name_format, check_desc_format
from .log import swanlog
from .package import get_package_version

# ---------------------------------- 一些常用但属于外部的东西 ----------------------------------

from swankit.env import get_swanlog_dir
