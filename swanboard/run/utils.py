#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-10 19:49:35
@File: swanboard/run/utils.py
@IDE: vscode
@Description:
    启动服务相关的工具函数
"""
from typing import MutableMapping, Optional
import os
from swanboard.utils import FONT
import psutil
import socket
import re

# ---------------------------------- 格式检查 ----------------------------------


def is_ipv4(string: str) -> bool:
    """判断字符串是否是一个ipv4地址

    Parameters
    ----------
    string : str
        待检查的字符串

    Returns
    -------
    bool
        如果是ipv4地址，返回True，否则返回False
    """
    pattern = re.compile(r"^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$")
    return isinstance(string, str) and pattern.match(string)


def is_port(string: str) -> bool:
    """判断字符串是否是一个端口号

    Parameters
    ----------
    string : str
        待检查的字符串

    Returns
    -------
    bool
        如果是端口号，返回True，否则返回False
    """
    if not is_int(string):
        return False
    port = int(string)
    return 0 <= port <= 65535


def is_int(string: str) -> bool:
    """判断字符串是否可以转换为整数

    Parameters
    ----------
    string : str
        待检查的字符串

    Returns
    -------
    bool
        如果可以转换为整数，返回True，否则返回False
    """
    try:
        int(string)
        return True
    except ValueError:
        return False


# ---------------------------------- 工具类 ----------------------------------


class URL(object):
    # 生成链接提示,先生成各个组件
    _arrow = "\t\t\t➜"
    arrow = FONT.bold(FONT.green(_arrow))
    local = arrow + FONT.bold("  Local:   ")
    netwo = arrow + FONT.bold("  Network: ")

    def __init__(self, ip, port) -> None:
        self.ip = ip
        self.port = port

    def __str__(self) -> str:
        url = FONT.blue(f"http://{self.ip}:{self.port}")
        if self.is_localhost(self.ip):
            return self.local + url
        else:
            return self.netwo + url

    @classmethod
    def last_tip(cls) -> str:
        """
        打印最后一条提示信息
        """
        t = FONT.dark_gray("  press ") + FONT.bold(FONT.default("ctrl + c")) + FONT.dark_gray(" to quit")
        return FONT.dark_green(cls._arrow) + t

    @staticmethod
    def is_localhost(ip):
        return ip == "127.0.0.1" or ip == "localhost"

    @staticmethod
    def is_zero_ip(ip):
        return ip == "0.0.0.0"

    @staticmethod
    def get_all_ip() -> list:
        """获取所有可用的ip地址

        Parameters
        ----------
        ip : str
            本机的ip地址

        Returns
        -------
        tuple
            所有可用的ip地址
        """
        interfaces = psutil.net_if_addrs()
        ipv4: list = []
        # APIPA 地址范围
        apipa_range = range(169, 255)
        for _, addresses in interfaces.items():
            for address in addresses:
                # 如果是ipv4地址，且可以被访问到
                if address.family == socket.AddressFamily.AF_INET:
                    # 排除 APIPA 地址范围
                    octets = list(map(int, address.address.split(".")))
                    if octets[0] == 169 and octets[1] in apipa_range:
                        continue
                    ipv4.append(address.address)
        # 对 IPv4 进行排序，"127.0.0.1" 在最前面，剩下按照从小到大排序
        ipv4.sort(key=lambda x: (x != "127.0.0.1", x), reverse=True)
        ipv4.reverse()
        return ipv4
