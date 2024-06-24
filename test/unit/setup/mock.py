from tutils import mock_project, mock_experiment


class TestMock:

    def test_mock_project(self):
        mock_project()

    def test_mock_experiment(self):
        exp1_id = mock_experiment(1, name="exp1")
        assert exp1_id == 1
        exp2_id = mock_experiment(1, name="exp2")
        assert exp2_id == 2
