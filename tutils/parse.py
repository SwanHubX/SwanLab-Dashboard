#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-15 19:45:49
@File: tutils/parse.py
@IDE: vscode
@Description:
    测试共用函数，主要是一些解析函数
"""
from fastapi.responses import JSONResponse
import json


def parse_json(res: JSONResponse):
    """解析 Fastapi 返回值为字典

    Parameters
    ----------
    res : JSONResponse
        Fastapi 处理函数的返回值
    """
    return json.loads(res.body)
