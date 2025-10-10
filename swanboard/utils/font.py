#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2023-12-11 21:41:08
@File: swanlab/utils/color.py
@IDE: vscode
@Description:
    颜色处理工具
"""

import sys
import re
from typing import Callable, Tuple
import threading
import time

light_colors = [
    "#528d59",  # 绿色
    "#587ad2",  # 蓝色
    "#c24d46",  # 红色
    "#9cbe5d",  # 青绿色
    "#6ebad3",  # 天蓝色
    "#dfb142",  # 橙色
    "#6d4ba4",  # 紫色
    "#8cc5b7",  # 淡青绿色
    "#892d58",  # 紫红色
    "#40877c",  # 深青绿色
    "#d0703c",  # 深橙色
    "#d47694",  # 粉红色
    "#e3b292",  # 淡橙色
    "#b15fbb",  # 浅紫红色
    "#905f4a",  # 棕色
    "#989fa3",  # 灰色
]

COLOR_LIST = {
    "light": light_colors,
    "dark": light_colors,
}


def generate_color(number: int = 1):
    """输入数字，在设定好顺序的颜色列表中返回十六进制颜色字符串

    Returns
    -------
    str
        颜色字符串,以#开头的十六进制字符串,如#FFFFFF
        字符串字母大写
    """

    if number % 16 == 0:
        number = 16
    else:
        number = number % 16

    return COLOR_LIST["light"][number - 1], COLOR_LIST["dark"][number - 1]