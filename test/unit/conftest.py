#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024/4/3 16:52
@File: conftest.py.py
@IDE: pycharm
@Description:
    配置pytest
"""
import pytest
from tutils import clear, create_test_dir


@pytest.fixture(scope="session", autouse=True)
def setup_before_all():
    clear()


@pytest.fixture(scope="class", autouse=True)
def setup_before_class():
    create_test_dir()
