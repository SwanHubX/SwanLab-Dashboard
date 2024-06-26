#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-26 15:14:39
@File: test/unit/db/pytest_swanmodel.py
@IDE: vscode
@Description:
    测试基础数据表模型
"""
import pytest
from tutils import mock_project
from swanboard.db import Project
from swanboard.db.model import SwanModel


class TestSwanModel:
    """测试各个表模型的基础父类"""

    @pytest.fixture(scope="class", autouse=True)
    def setup(self):
        """启动前创建一个项目"""
        project_id = mock_project()
        assert project_id == 1
        yield Project.filter(Project.id == project_id)

    def test_search2dict(self, setup):
        """将查询结果转换为字典"""
        res_dict = SwanModel.search2dict(setup)
        assert isinstance(res_dict, dict)

    def test_search2list(self, setup):
        """将查询结果转换为列表"""
        res_list = SwanModel.search2list(setup)
        assert isinstance(res_list, list)

    def test_json2dict(self):
        """将json字符串转换为字典"""
        res_dict = SwanModel.json2dict('{"key": "value"}')
        assert res_dict == {"key": "value"}

    def test_json2dict_with_empty(self):
        """传递参数为空字符串"""
        res_dict = SwanModel.json2dict("")
        assert res_dict == {}

    def test_dict2json(self):
        """转化字典为json字符串"""
        res_json = SwanModel.dict2json({"key": "value"})
        assert res_json == '{"key": "value"}'

    def test_dict2json_with_json(self):
        """传递参数已经是json字符串"""
        res_json = SwanModel.dict2json('{"key": "value"}')
        assert res_json == '{"key": "value"}'
