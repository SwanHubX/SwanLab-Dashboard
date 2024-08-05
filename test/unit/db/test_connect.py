#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-26 15:49:02
@File: test/unit/db/pytest_connect.py
@IDE: vscode
@Description:
    测试数据库连接函数
"""

from swanboard.db import connect, tables
from tutils import create_test_dir
import os
import shutil


class TestConnectDB:
    """
    因为在每个单元测试开启之前都会自动在默认目录下连接数据库
    所以若要对数据库的创建/连接情况进行测试，需要重新创建目录
    """

    def test_create_db(self):
        path = create_test_dir("test_for_connect")
        connect(path, autocreate=True)
        # 在path下有 run.swanlab 文件
        assert os.path.exists(os.path.join(path, "runs.swanlab"))
        if os.path.exists(path):
            shutil.rmtree(path)

    def test_create_tables(self):
        """测试是否自动创建数据表"""
        path = create_test_dir("test_for_connect")
        db = connect(path, autocreate=True)
        # 在数据库中有各个数据表
        for table in tables:
            assert db.table_exists(table)
        if os.path.exists(path):
            shutil.rmtree(path)
