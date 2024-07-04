#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-30 14:37:33
@File: test/unit/db/test_migrate.py
@IDE: vscode
@Description:
    测试兼容性迁移脚本
"""
from swanboard.db.migrate import compat_tag_key
from peewee import SqliteDatabase
from tutils import create_test_dir, mock_experiment
from swanboard.db import (
    Project,
    Tag,
)
from swankit.env import create_time
from urllib.parse import quote
import os
import nanoid


def init_db(db_path: str):
    # 模拟 项目=>实验=>tag
    project = Project.init("test_project_for_migrate")
    experiment_id = mock_experiment(project.id)
    db_path = os.path.join(db_path, "runs.swanlab")
    swandb = SqliteDatabase(db_path)
    # 删除 tag 表，重新创建一个没有 folder 字段的 tag 表
    swandb.execute_sql("DROP TABLE IF EXISTS tag")
    swandb.execute_sql(
        "CREATE TABLE tag (id INTEGER PRIMARY KEY AUTOINCREMENT, experiment_id INTEGER, name TEXT, type TEXT, description TEXT, system INTEGER, sort INTEGER, more TEXT, create_time TEXT, update_time TEXT)"
    )
    return swandb, experiment_id


def mock_tag_data(experiment_id: int, name: str):
    # 向 experiment 下添加 tag，该 tag 记录没有 folder 字段
    raw_sql = """
        INSERT INTO tag (experiment_id, name, type, description, system, sort, more, create_time, update_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    time = create_time()
    params = (
        experiment_id,  # experiment_id
        name,  # name
        "default",  # type
        "test_description",  # description
        0,  # system
        0,  # sort
        "",  # more
        time,  # create_time
        time,  # update_time
    )
    wrapper = Tag.raw(raw_sql, *params).execute()


class TestMigrateForTag:

    def test_compat_tag_key(self):
        db_path = create_test_dir("test_migrate")
        # 重新初始化一个数据库，其中 tag 表没有 folder 字段
        swandb, experiment_id = init_db(db_path)
        assert not Tag.field_exists("folder")
        # 模拟 tag 记录，并创建各自的独立存储目录
        list = [nanoid.generate(size=10), f"{nanoid.generate(size=4)}/{nanoid.generate(size=4)}"]
        with swandb.atomic():
            for name in list:
                mock_tag_data(experiment_id, name)
        compat_tag_key(swandb)
        # 含有 folder 字段，且值为转义后的 tag name
        assert Tag.field_exists("folder")
        for tag in Tag.select():
            assert tag.folder == quote(tag.name, safe="")
