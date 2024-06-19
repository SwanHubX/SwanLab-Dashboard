#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024/4/28 16:21
@File: pytest_file.py
@IDE: pycharm
@Description:
    测试文件格式函数
"""
import pytest
from nanoid import generate

# noinspection PyProtectedMember
from swanboard.utils import check_desc_format, check_exp_name_format
from swanboard.utils.file import _auto_cut


class TestAutoCut:
    @pytest.mark.parametrize(
        "name, value",
        [
            [generate(), generate(size=101)],
            [generate(), generate(size=1000)],
            [generate(), generate(size=10000)],
        ],
    )
    def test_cut(self, name: str, value: str):
        """
        测试自动截断
        """
        assert len(_auto_cut(name, value, 100, True)) == 100

    @pytest.mark.parametrize(
        "name, value",
        [
            [generate(), generate(size=101)],
            [generate(), generate(size=1000)],
            [generate(), generate(size=10000)],
        ],
    )
    def test_no_cut(self, name: str, value: str):
        """
        测试不自动截断
        """
        with pytest.raises(IndexError) as e:
            _auto_cut(name, value, 100, False)
        assert name in str(e.value)


class TestExpName:
    @pytest.mark.parametrize(
        "value",
        [
            generate(size=100),
            generate(size=1),
            "-",
            "_",
        ],
    )
    def test_exp_name_common(self, value):
        """
        测试正常情况
        """
        assert check_exp_name_format(value) == value

    @pytest.mark.parametrize("value", [None, 1, [], {}])
    def test_exp_name_type_error(self, value: str):
        """
        测试类型错误
        """
        with pytest.raises(TypeError):
            check_exp_name_format(value)

    @pytest.mark.parametrize("value", ["啊哈哈", "&^%", "/;]x]", generate(size=100), "👨‍💻👨‍💻👨‍💻👨‍💻👨‍"])
    def test_exp_name_value_special(self, value: str):
        """
        测试特殊值
        """
        assert check_exp_name_format(value) == value

    @pytest.mark.parametrize(
        "value",
        [
            "",
            "   ",
        ],
    )
    def test_exp_name_value_empty(self, value: str):
        """
        测试空值
        """
        with pytest.raises(ValueError):
            check_exp_name_format(value)

    @pytest.mark.parametrize(
        "value",
        [
            generate(size=101),
            generate(size=1000),
            generate(size=10000),
        ],
    )
    def test_exp_name_auto_cut(self, value: str):
        """
        测试自动截断
        """
        assert len(check_exp_name_format(value)) == 100

    @pytest.mark.parametrize(
        "value",
        [
            generate(size=101),
            generate(size=1000),
            generate(size=10000),
        ],
    )
    def test_exp_name_no_cut(self, value: str):
        """
        测试不自动截断
        """
        with pytest.raises(IndexError):
            check_exp_name_format(value, auto_cut=False)


class TestDesc:
    @pytest.mark.parametrize("value", [generate(size=100), generate(size=1), "-", "_", "👾👾👾👾👾👾"])
    def test_desc_common(self, value):
        """
        测试正常情况
        """
        assert check_desc_format(value) == value

    @pytest.mark.parametrize("value", [None, 1, [], {}])
    def test_desc_type_error(self, value: str):
        """
        测试类型错误
        """
        with pytest.raises(TypeError):
            check_desc_format(value)

    @pytest.mark.parametrize("value", ["", "   ", " " * 256])
    def test_desc_value_empty(self, value: str):
        """
        测试空值
        """
        assert check_desc_format(value) == ""
