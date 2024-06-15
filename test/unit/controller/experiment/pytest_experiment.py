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


class TestExperimentModel:

    def test_connect(self):
        res = Experiment.create(name="test", run_id=generate(size=10))
