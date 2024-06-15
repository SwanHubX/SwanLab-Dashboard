#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-14 19:47:27
@File: test/unit/controller/experiment.py
@IDE: vscode
@Description:
    实验相关测试用例
"""
from swanboard.db import Experiment
from nanoid import generate
import pytest
from swanboard.controller.experiment import (
    get_experiment_info,
    get_tag_data,
    get_experiment_status,
    get_experiment_summary,
    get_recent_logs,
    get_experimet_charts,
    update_experiment_info,
    delete_experiment,
    stop_experiment,
    get_experiment_requirements,
    change_experiment_visibility,
)


class TestGetExperimentInfo:

    def test(self):
        res = Experiment.create(name="test", run_id=generate(size=10))
