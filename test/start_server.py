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
from swanboard.db import connect
import os
from swanboard import SwanBoardRun

SWANLAB_LOG_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "swanlog")

os.environ["SWANLAB_LOG_DIR"] = SWANLAB_LOG_DIR
connect(SWANLAB_LOG_DIR)


if __name__ == "__main__":
    SwanBoardRun.run(path=SWANLAB_LOG_DIR, host="0.0.0.0", port=6092)
