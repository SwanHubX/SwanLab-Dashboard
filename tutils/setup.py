import shutil
import os
from .env import *
from .parse import *
from swanboard.db import connect


def clear():
    """
    清空临时文件夹, 重新创建
    """
    if os.path.exists(TEMP_PATH):
        shutil.rmtree(TEMP_PATH)
    os.mkdir(TEMP_PATH)


count = 0


def create_private_db():
    """对于每个单元测试，都独立在 temp 目录下创建一个私有的临时文件夹"""
    global count
    count += 1
    path = os.path.join(TEMP_PATH, str(count))
    os.mkdir(path)
    connect(path, autocreate=True)
    return path
