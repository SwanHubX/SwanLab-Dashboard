#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-24 15:16:30
@File: tutils/mock/db.py
@IDE: vscode
@Description:
    单元测试中的数据模拟mock函数
"""
from nanoid import generate
from swanboard.db import Project, Experiment, Tag, Chart, Namespace, Source, Display
from swankit.env import create_time
from swanboard.utils import generate_color


DEFAULT_PROJECT_ID = 1


def mock_project(name=generate(size=10), description=""):
    """模拟生成项目"""

    raw_sql = """
        INSERT INTO project (name, description, sum, charts, pinned_opened, hidden_opened, more, version, create_time, update_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    params = (
        name,  # name
        description,  # description
        0,  # sum
        0,  # charts
        1,  # pinned_opened
        0,  # hidden_opened
        "",  # more
        "test",  # version
        create_time(),  # create_time
        create_time(),  # update_time
    )

    wrapper = Project.raw(raw_sql, *params).execute()
    return wrapper.cursor.lastrowid


def mock_experiment(project_id=DEFAULT_PROJECT_ID, name=None, description=""):
    """模拟生成实验"""

    if name is None:
        name = generate(size=10)

    _sum = Project.increase_sum(project_id)
    raw_sql = """
        INSERT INTO experiment (project_id, run_id, name, description, sort, status, show, light, dark, pinned_opened, hidden_opened, more, version, create_time, update_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    light, dark = generate_color(_sum)
    params = (
        project_id,
        generate(size=10),  # run_id
        name,  # name
        description,  # description
        _sum,  # sort
        0,  # status
        1,  # show
        light,  # light
        dark,  # dark
        1,  # pinned_opened
        0,  # hidden_opened
        "",  # more
        "test",  # version
        create_time(),  # create_time
        create_time(),  # update_time
    )

    wrapper = Experiment.raw(raw_sql, *params).execute()
    return wrapper.cursor.lastrowid
