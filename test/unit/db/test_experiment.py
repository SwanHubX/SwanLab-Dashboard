#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-26 15:17:56
@File: test/unit/db/pytest_experiment.py
@IDE: vscode
@Description:
    测试实验数据表模型
"""
import pytest
import nanoid
import os
from tutils import mock_project, mock_experiment, mock_folder_with_run_id
from swanboard.db import Experiment
from swanboard.db.error import ExistedError, NotExistedError


class TestExperiment:

    @pytest.fixture(scope="class", autouse=True)
    def setup(self):
        """在测试实验之前，需要一个默认项目"""
        project_id = mock_project()
        assert project_id == 1

    def test_create(self):
        """正常创建一个实验"""
        name = nanoid.generate(size=10)
        run_id = nanoid.generate(size=10)
        e = Experiment.create(name=name, run_id=run_id)
        assert e.name == name
        assert e.run_id == run_id
        assert e.project_id.id == 1

    def test_duplicate_name(self):
        """实验名重复"""
        name = nanoid.generate(size=10)
        run_id = nanoid.generate(size=10)
        e = Experiment.create(name=name, run_id=run_id)
        with pytest.raises(ExistedError):
            Experiment.create(name=name, run_id=nanoid.generate(size=10))

    def test_duplicate_run_id(self):
        """实验run_id重复"""
        name = nanoid.generate(size=10)
        run_id = nanoid.generate(size=10)
        e = Experiment.create(name=name, run_id=run_id)
        with pytest.raises(ExistedError):
            Experiment.create(name=nanoid.generate(size=10), run_id=run_id)

    def test_get_experiment(self):
        """正常获取一个实验"""
        e_id = mock_experiment()
        assert Experiment.get(e_id).id == e_id

    def test_get_nonexistent_experiment(self):
        """获取一个不存在的实验"""
        with pytest.raises(NotExistedError):
            Experiment.get(10000)

    def test_update_status_to_finished(self):
        """更新实验状态为结束"""
        e = Experiment.create(name=nanoid.generate(size=10), run_id=nanoid.generate(size=10))
        assert e.status == 0
        e.update_status(1)
        target = Experiment.get(e.id)
        assert target.status == 1

    def test_update_status_to_crashed(self):
        """更新实验状态为结束"""
        e = Experiment.create(name=nanoid.generate(size=10), run_id=nanoid.generate(size=10))
        assert e.status == 0
        e.update_status(-1)
        target = Experiment.get(e.id)
        assert target.status == -1

    def test_purely_delete(self):
        """正常删除一个实验"""
        name = nanoid.generate(size=10)
        run_id = nanoid.generate(size=10)
        e = Experiment.create(name=name, run_id=run_id)
        # 创建实验对应目录
        path = mock_folder_with_run_id(run_id)
        assert os.path.exists(path) is True
        e.purely_delete(run_id)
        # 删除之后 path 将不再存在
        assert os.path.exists(path) is False
