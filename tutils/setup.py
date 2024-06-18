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


def create_test_dir(dirname="swan-test"):
    """对于每个单元测试，都独立在 temp 目录下创建一个私有的临时文件夹"""
    test_path = os.path.join(TEMP_PATH, dirname)
    if os.path.exists(test_path):
        shutil.rmtree(test_path)
    os.mkdir(test_path)
    connect(test_path, autocreate=True)
    return test_path
