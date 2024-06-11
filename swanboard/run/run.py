#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-10 19:43:56
@File: swanboard/run.py
@IDE: vscode
@Description:
    启动服务
"""
import uvicorn
from .utils import get_server_host, get_server_port, URL
import time

# swanlab
from swanlab.utils import FONT
from swanlab.package import get_package_version, version_limit
from swanlab.log import swanlog as swl
from swanlab.env import get_swanlog_dir

# swanboard
from swanboard.app import app
from swanboard.db import connect


def run(log_level):
    start = time.time()
    log_dir = get_swanlog_dir()
    version_limit(log_dir, mode="watch")
    # debug一下当前日志文件夹的位置
    swl.debug("Try to explore the swanlab experiment logs in: " + FONT.bold(log_dir))
    try:
        connect()
    except FileNotFoundError:
        swl.error("Can not find the swanlab db in: " + FONT.bold(log_dir))
    # ---------------------------------- 日志等级处理 ----------------------------------
    swl.set_level(log_level)
    # ---------------------------------- 服务地址处理 ----------------------------------
    # 当前服务地址
    host = get_server_host()
    # 当前服务端口
    port = get_server_port()
    # 所有可用ip
    ipv4 = URL.get_all_ip()
    # ---------------------------------- 日志打印 ----------------------------------
    # 耗时
    take_time = int((time.time() - start) * 1000).__str__() + "ms\n\n"
    # 可用URL
    if URL.is_zero_ip(host):
        tip = "\n".join([URL(i, port).__str__() for i in ipv4])
    else:
        tip = URL(host, port).__str__()
    tip = tip + "\n" + URL.last_tip() + "\n"
    v = FONT.bold("v" + get_package_version())
    swl.info(f"SwanLab Experiment Dashboard " + v + " ready in " + FONT.bold(take_time) + tip)
    # ---------------------------------- 启动服务 ----------------------------------
    # 使用 uvicorn 启动 FastAPI 应用，关闭原生日志
    # 使用try except 捕获退出，涉及端口占用等
    try:
        uvicorn.run(app, host=host, port=port, log_level="critical")
    except SystemExit as e:
        code = e.code
        if code == 1:
            critical = "Error while attempting to bind on address ({}, {}): address already in use".format(host, port)
            swl.critical(critical)
        else:
            swl.critical("Unhandled Exit Code: {}".format(code))
