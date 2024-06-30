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
from swanboard.db import connect
from peewee import SqliteDatabase
from tutils import create_test_dir, mock_experiment, mock_folder_with_run_id
from swanboard.db import (
    Project,
    Experiment,
    Tag,
)
from swankit.env import create_time
import os
import shutil


class TestMigrateForTag:

    def test_create_db(self):
        db_path = create_test_dir("test_migrate")
        assert os.path.exists(db_path)
        if os.path.exists(db_path):
            shutil.rmtree(db_path)

    def test_compat_tag_key(self):
        db_path = create_test_dir("test_migrate")
        project = Project.init("test_project_for_migrate")
        experiment_id = mock_experiment(project.id)
        run_id = Experiment.get(Experiment.id == experiment_id).run_id
        path = mock_folder_with_run_id(run_id, path=db_path)
        # 向 experiment 下添加 tag，该 tag 记录没有 folder 字段
        raw_sql = """
            INSERT INTO tag (experiment_id, name, type, description, system, sort, more, create_time, update_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        time = create_time()
        params = (
            experiment_id,  # experiment_id
            "test_tag",  # name
            "default",  # type
            "test_description",  # description
            0,  # system
            0,  # sort
            "",  # more
            time,  # create_time
            time,  # update_time
        )
        wrapper = Tag.raw(raw_sql, *params).execute()
        # compat_tag_key(SqliteDatabase(db_path))
