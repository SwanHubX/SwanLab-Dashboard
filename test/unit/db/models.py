from swanboard.db import (
    Project,
    Experiment,
    Tag,
    Chart,
    Namespace,
    Source,
    Display,
)
from tutils import create_test_dir
import nanoid


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
