from swanboard.controller.project import (
    get_project_info,
    get_project_summary,
    update_project_info,
    delete_project,
    get_project_charts,
)
from tutils import parse_json
from swanboard.db import Project


class TestProjectGetInfo:

    def test_default_project(self):
        res = parse_json(get_project_info())
        data = res["data"]
        assert res["code"] == 0
        assert data["id"] == 1
