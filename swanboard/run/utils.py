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
from swanboard.utils.file import is_port, is_ipv4
from swanlab.utils import FONT
import psutil
import socket


# ---------------------------------- 环境变量相关 ----------------------------------

Env = Optional[MutableMapping]

_env = dict()
"""运行时环境变量参数存储，实际上就是一个字典"""

PORT = "SWANLAB_SERVER_PORT"
"""服务端口SWANLAB_SERVER_PORT，服务端口"""

HOST = "SWANLAB_SERVER_HOST"
"""服务端口SWANLAB_SERVER_PORT，服务地址"""


# ---------------------------------- 工具函数 ----------------------------------


def get_server_port(env: Optional[Env] = None) -> Optional[int]:
    """获取服务端口

    Parameters
    ----------
    env : Optional[Env], optional
        环境变量map,可以是任意实现了MutableMapping的对象, 默认将使用os.environ

    Returns
    -------
    Optional[int]
        服务端口
    """
    # 第一次调用时，从环境变量中提取，之后就不再提取，而是从缓存中提取
    if _env.get(PORT) is not None:
        return _env.get(PORT)
    # 否则从环境变量中提取
    if env is None:
        env = os.environ
    default: Optional[int] = 5092
    port = env.get(PORT, default=default)
    # 必须可以转换为整数，且在0-65535之间
    if not is_port(port):
        raise ValueError('SWANLAB_SERVER_PORT must be a port, now is "{port}"'.format(port=port))
    _env[PORT] = int(port)
    return _env.get(PORT)


def get_server_host(env: Optional[Env] = None) -> Optional[str]:
    """获取服务端口

    Parameters
    ----------
    env : Optional[Env], optional
        环境变量map,可以是任意实现了MutableMapping的对象, 默认将使用os.environ

    Returns
    -------
    Optional[int]
        服务端口
    """
    default: Optional[str] = "127.0.0.1"
    # 第一次调用时，从环境变量中提取，之后就不再提取，而是从缓存中提取
    if _env.get(HOST) is not None:
        return _env.get(HOST)
    # 否则从环境变量中提取
    if env is None:
        env = os.environ
    _env[HOST] = env.get(HOST, default=default)
    # 必须是一个ipv4地址
    if not is_ipv4(_env.get(HOST)):
        raise ValueError('SWANLAB_SERVER_HOST must be an ipv4 address, now is "{host}"'.format(host=_env.get(HOST)))
    return _env.get(HOST)


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
