#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-02-05 16:56:06
@File: swanlab/db/connect.py
@IDE: vscode
@Description:
    数据库连接模块
"""
import os
from peewee import SqliteDatabase
from .table_config import tables, Tag
from .migrate import compat_tag_key

db_path = None
"""
全局挂载的数据库路径，当autocreate设置为True时，必须指定此路路径
可用于判断数据库是否已经创建
"""


def connect(path: str = None, autocreate: bool = False) -> SqliteDatabase:
    """
    连接数据库，只有调用此方法以后，数据库才会被创建，所有导出的类才可用


    Parameters:
    ----------
    path : str
        数据库路径，第一次连接时必须指定数据库路径
        后续使用如果不指定，会使用第一次指定的路径，如果再次指定，会覆盖第一次指定的路径
    autocreate : bool
        是否自动创建数据库，如果设置为True，当数据库不存在时，会自动创建数据库
        如果设置为False，当数据库不存在时，会抛出FileNotFoundError异常
        设置此参数是为了严格控制数据库创建行为，避免误操作

    Return:
    -------
    swandb :
        数据库实例

    Raises:
    -------
    FileNotFoundError :
        如果数据库不存在，并且autocreate为False，则会抛出FileNotFoundError异常
    ValueError :
        如果指定了路径但是没有设置autocreate为True，则会抛出ValueError异常
    """
    global db_path
    bound = True
    # 覆盖全局变量后需要重新创建数据库
    if not path and not db_path:
        raise ValueError("First time connect must specify the path")
    elif path:
        # 覆盖全局变量
        db_path = os.path.join(path, "runs.swanlab")
        bound = False
    # 检查数据库是否存在，不存在就创建
    db_exists = os.path.exists(db_path)
    if not db_exists and not autocreate:
        raise FileNotFoundError(f"DB file {db_path} not found")
    # 启用外键约束
    swandb = SqliteDatabase(db_path, pragmas={"foreign_keys": 1})
    if not bound:
        # 动态绑定数据库
        swandb.connect()
        swandb.bind(tables)
        swandb.create_tables(tables)
        swandb.close()
        if not Tag.field_exists("folder"):
            # 添加 folder 字段
            compat_tag_key(SqliteDatabase(db_path))
    return swandb
