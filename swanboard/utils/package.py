#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-15 15:50:00
@File: swanboard/utils/package.py
@IDE: vscode
@Description:
    包相关的工具函数
"""
from importlib.metadata import version


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
    # 获取已安装包的版本
    try:
        v = version('swanlab')
        return v if v else 'unknown'
    except Exception as e:  # noqa
        return 'unknown'
