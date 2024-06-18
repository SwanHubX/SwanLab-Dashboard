from swanboard.db import (
    Project,
    Experiment,
    Tag,
    Chart,
    Namespace,
    Source,
    Display,
)
from tutils import create_private_db


class TestModels:
    def setup_method(self):
        create_private_db()

    def test_project(self):
        pass

    def test_experiment(self):
        pass

    def test_tag(self):
        pass

    def test_chart(self):
        pass

    def test_namespace(self):
        pass

    def test_source(self):
        pass

    def test_display(self):
        pass
