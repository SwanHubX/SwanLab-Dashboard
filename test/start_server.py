#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2023-11-24 21:12:52
@File: test/start_server.py
@IDE: vscode
@Description:
    开启后端测试服务，访问端口
    事实上在使用中并不是这样的，而是在命令行执行命令完成的，这里只是为了测试和开发
    增加了实际开发中不会用到的热启动功能
"""
from tutils.config import SWANLAB_LOG_DIR
from swanboard.db import connect
from swanboard.app import app
import os
from swanboard import run
from swanlab.env import get_server_host, get_server_port
from swanlab.cli.utils import URL

os.environ["SWANLAB_LOG_DIR"] = SWANLAB_LOG_DIR

connect()


def main():
    return app


if __name__ == "__main__":
    run()
