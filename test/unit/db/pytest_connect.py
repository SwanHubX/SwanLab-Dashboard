from swanboard.db import connect, tables
from tutils import create_test_dir
import os
import shutil
import pytest


class TestConnectDB:
    @pytest.fixture(scope="class")
    def setup_before_class(self):
        pass

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
