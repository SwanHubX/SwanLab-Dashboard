from swanboard.db import (
    Project,
    Experiment,
    Tag,
    Chart,
    Namespace,
    Source,
    Display,
)
from swanboard.db.model import SwanModel
import nanoid


class TestSwanModel:
    """测试各个表模型的基础父类"""

    def test_search2dict(self):
        pass

    def test_search2list(self):
        pass

    def test_json2dict(self):
        pass

    def test_dict2json(self):
        pass


class TestProject:

    def test_init(self):
        name = nanoid.generate(size=10)
        p = Project.init(name)
        assert p.name == name


class TestExperiment:

    def test_create(self):
        pass


class TestTag:

    def test_create(self):
        pass


class TestChart:

    def test_create(self):
        pass


class TestNamespace:

    def test_create(self):
        pass


class TestSource:

    def test_create(self):
        pass


class TestDisplay:

    def test_create(self):
        pass
