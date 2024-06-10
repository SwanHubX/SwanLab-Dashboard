#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-10 15:30:29
@File: build.py
@IDE: vscode
@Description:
    打包前端，并构建pypi包
"""
import subprocess
import shutil
import os

# 如果node_modules文件夹存在则不运行npm install
if not os.path.exists("node_modules"):
    # 安装依赖
    subprocess.run("npm install", shell=True)
# 构建node项目
subprocess.run("npm run build.release", shell=True)
# 如果dist文件夹存在则删除
if os.path.exists("dist"):
    shutil.rmtree("dist")
# 构建python项目
subprocess.run("python -m build", shell=True)
