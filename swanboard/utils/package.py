#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-15 15:50:00
@File: swanboard/utils/package.py
@IDE: vscode
@Description:
    包相关的工具函数
"""
import pkg_resources


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
    try:
        version = pkg_resources.get_distribution("swanlab").version
        return version
    except pkg_resources.DistributionNotFound:
        return "swanlab package is not installed"
