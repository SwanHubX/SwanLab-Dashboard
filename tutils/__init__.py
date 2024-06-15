#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024/4/21 17:01
@File: __init__.py
@IDE: pycharm
@Description:
    tutils模块的初始化文件
"""

import shutil
import os
from .config import *


def clear():
    """
    清空临时文件夹, 重新创建
    """
    if os.path.exists(TEMP_PATH):
        shutil.rmtree(TEMP_PATH)
    os.mkdir(TEMP_PATH)
    os.mkdir(SWANLAB_LOG_DIR)
    os.mkdir(SWANLAB_DIR)


def init_db():
    """
    初始化数据库
    """
    from swanboard.db import connect, Project

    clear()
    os.environ["IS_TEST"] = "TRUE"
    connect(SWANLAB_LOG_DIR, autocreate=True)
    Project.init(name="pytest-swanlab", description="测试swanlab")
