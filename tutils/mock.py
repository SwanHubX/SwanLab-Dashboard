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
from swanlab.swankit.env import create_time
from swanboard.utils import generate_color
from .env import TEST_PATH
import os


DEFAULT_PROJECT_ID = 1


def mock_project(name=None, description=""):
    """模拟生成项目"""

    if name is None:
        name = generate(size=10)

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


def mock_folder_with_run_id(run_id, path=TEST_PATH):
    """在 temp 文件夹下生成 run_id 对应的文件夹

    Parameters
    ----------
    run_id : string
        以实验唯一标识为名的目录
    """
    path = os.path.join(path, run_id)
    os.makedirs(path, exist_ok=True)
    return path


def mock_experiment_with_folder(project_id=DEFAULT_PROJECT_ID, name=None, description=""):
    """创建一个实验记录，并附带创建对应的文件夹"""
    exp_id = mock_experiment(project_id, name, description)
    run_id = Experiment.get(Experiment.id == exp_id).run_id
    path = mock_folder_with_run_id(run_id)
    return exp_id, path


def mock_tag(experiment_id: int):
    """模拟创建一个 tag 记录"""
    # 向 experiment 下添加 tag
    raw_sql = """
        INSERT INTO tag (experiment_id, name, folder, type, description, system, sort, more, create_time, update_time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    # 计算当前实验下有多少个 tag
    tag_count = Tag.select().where(Tag.experiment_id == experiment_id).count()
    time = create_time()
    params = (
        experiment_id,  # experiment_id
        "test_tag",  # name
        tag_count,  # folder
        "default",  # type
        "test_description",  # description
        0,  # system
        0,  # sort
        "",  # more
        time,  # create_time
        time,  # update_time
    )
    wrapper = Tag.raw(raw_sql, *params).execute()
