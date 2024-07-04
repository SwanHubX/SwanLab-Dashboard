#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-26 15:16:04
@File: test/unit/db/pytest_project.py
@IDE: vscode
@Description:
    测试项目数据表模型
"""
from tutils import mock_project
from swanboard.db import Project
import nanoid


class TestProject:

    def test_init(self):
        """测试初始化一个默认项目，如果项目已存在则跳过"""
        name = nanoid.generate(size=10)
        p = Project.init(name)
        project = Project.filter(Project.id == p.id).first()
        assert project.name == name
        assert project.sum == None
        assert project.charts == 0
        assert project.pinned_opened == 1
        assert project.hidden_opened == 0
        p2 = Project.init(name)
        assert p2.id == p.id

    def test_increase_sum(self):
        """测试增加项目实验数"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0
        assert project.increase_sum(project_id) == 1
        assert project.increase_sum(project_id) == 2
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 2

    def test_decrease_sum_with_zero(self):
        """测试减少项目实验数，不允许出现负数"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0
        assert project.decrease_sum(project_id) == 0
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0

    def test_decrease_sum_with_many(self):
        """正常情况下，测试减少项目实验数"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 0
        assert project.increase_sum(project_id) == 1
        assert project.increase_sum(project_id) == 2
        assert project.decrease_sum(project_id) == 1
        project = Project.filter(Project.id == project_id).first()
        assert project.sum == 1

    def test_2dict(self):
        """将实例转成字典"""
        project_id = mock_project()
        project = Project.filter(Project.id == project_id).first()
        assert isinstance(project.__dict__(), dict)
