#!/usr/bin/env python
# -*- coding: utf-8 -*-
r"""
@DATE: 2024-06-30 14:13:45
@File: swanboard/db/migrate.py
@IDE: vscode
@Description:
    可能需要对之前的版本进行兼容
"""
from peewee import CharField
from playhouse.migrate import migrate, SqliteMigrator
from swanboard.db import Tag
from urllib.parse import quote


def compat_tag_key(db):
    """
    对于windows，可能会因为一些保留字的原因而导致tag目录无法创建
    为了以通用方式解决该问题，在0.1.2b8版本以后进行兼容操作：
    为 tag 表新增 folder 字段，该字段对应于实验目录下的 tag 目录
    - 旧版本中，将 tag name 写入 folder 字段
    - 新版本，以 tag id 为 folder 字段值
    """

    migrator = SqliteMigrator(db)
    folder = CharField(default="")
    migrate(migrator.add_column("tag", "folder", folder))

    with db.atomic():
        for tag in Tag.select():
            tag.folder = quote(tag.name, safe="")
            tag.save()
