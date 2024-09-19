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
import json

# 如果node_modules文件夹存在则不运行npm install
if not os.path.exists("node_modules"):
    # 安装依赖
    subprocess.run("npm install", shell=True)
# 构建node项目
subprocess.run("npm run build.release", shell=True)
# 如果dist文件夹存在则删除
if os.path.exists("dist"):
    shutil.rmtree("dist")

# 设置版本号
version = os.getenv("VERSION")
if not version:
    raise ValueError("尚未指定构建版本号，请设置VERSION环境变量，如`export VERSION=0.6.0`")
with open("swanboard/package.json", "r+") as f:
    p = json.load(f)
    p["version"] = version
    f.seek(0)
    json.dump(p, f, indent=4)
    f.truncate()

# 构建python项目
subprocess.run("python -m build", shell=True)
