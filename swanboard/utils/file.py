#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2023-12-02 13:23:42
@File: swanlab\utils\file.py
@IDE: vscode
@Description:
    文件操作
"""
import os
import re
import ujson
import yaml

# ---------------------------------- 一些格式检查的工具函数 ----------------------------------


def check_string(target: str) -> bool:
    """
    检查是否为字符串，且不能全空格，也不能为空字符串
    :param target: 待检查的字符串
    :return: bool
    :raises:
        :raise TypeError: name不是字符串
    """
    if not isinstance(target, str):
        raise TypeError(f"name: {target} is not a string: {type(target)}")
    # 利用正则表达式匹配非空格字符
    if re.match(r"^\s*$", target):
        return False
    # 利用正则表达式匹配非空字符串
    if re.match(r"^\s*$", target) or target == "":
        return False
    return True


# ---------------------------------- 实验、项目相关 ----------------------------------


def _auto_cut(name: str, value: str, max_len: int, cut: bool) -> str:
    """
    检查长度
    :param name: 参数名称
    :param value: 参数值
    :param max_len: 最大长度
    :return: str 检查后的字符串
    :raises
        :raise IndexError: cut为False且name超出长度
    """
    if len(value) > max_len:
        if cut:
            value = value[:max_len]
        else:
            raise IndexError(f"Name: {name} is too long, which must be less than {max_len} characters")
    return value


def check_exp_name_format(name: str, auto_cut: bool = True) -> str:
    """
    检查实验名称格式，最大长度为100个字符，一个中文字符算一个字符
    其他不做限制，实验名称可以包含任何字符

    Parameters
    ----------
    name : str
        待检查的字符串
    auto_cut : bool, optional
        如果超出长度，是否自动截断，默认为True
        如果为False，则超出长度会抛出异常

    Returns
    -------
    str
        检查后的字符串

    Raises
    ------
    TypeError
        name不是字符串
    ValueError
        name为空字符串
    IndexError
        name超出长度
    """
    max_len = 100
    if not check_string(name):
        raise ValueError(f"Experiment name `{name}` is an empty string.")
    # 检查长度
    return _auto_cut("experiment", name, max_len, auto_cut)


def check_desc_format(description: str, auto_cut: bool = True):
    """检查实验描述
    不能超过255个字符，可以包含任何字符

    Parameters
    ----------
    description : str
        需要检查和处理的描述信息
    auto_cut : bool
        如果超出长度，是否裁剪并抛弃多余部分

    Returns
    -------
    str
        检查后的字符串，同时会去除字符串头尾的空格

    Raises
    ------
    IndexError
        name超出长度
    """
    max_length = 255
    check_string(description)
    description = description.strip()
    return _auto_cut("description", description, max_length, auto_cut)
