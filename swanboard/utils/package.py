#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-15 15:50:00
@File: swanboard/utils/package.py
@IDE: vscode
@Description:
    包相关的工具函数
"""
import os
import json


def get_package_version() -> str:
    """获取swanlab的版本号

    Parameters
    ----------
    p : str, optional
        package.json文件路径，默认为项目的package.json

    Returns
    -------
    str
        swanlab的版本号
    """
    path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "package.json")
    # 读取package.json文件
    with open(path, "r") as f:
        return json.load(f)["version"]
