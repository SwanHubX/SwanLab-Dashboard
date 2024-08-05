#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-07-01 20:41:20
@File: test/unit/setup/test_setup.py
@IDE: vscode
@Description:
    测试初始化函数
"""
from tutils import create_test_dir
import os


def test_create_test_dir():
    """测试创建测试文件夹"""
    path = create_test_dir("test_for_create_dir")
    assert os.path.exists(path)
