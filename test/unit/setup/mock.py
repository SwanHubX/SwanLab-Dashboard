from tutils import (
    mock_project,
    mock_experiment,
    mock_folder_with_run_id,
    mock_experiment_with_folder,
)
import os
import nanoid


def test_mock_project():
    """在数据库中模拟一个项目记录"""
    proj_id = mock_project()
    assert proj_id == 1


def test_mock_experiment():
    """在数据库中模拟创建实验记录"""
    mock_project()
    exp1_id = mock_experiment(1, name="exp1")
    assert exp1_id == 1
    exp2_id = mock_experiment(1, name="exp2")
    assert exp2_id == 2


def test_mock_folder_with_run_id():
    """在测试目录下创建目录"""
    path = mock_folder_with_run_id(nanoid.generate(size=10))
    assert os.path.exists(path)


def test_mock_experiment_with_folder(project_id=1):
    """创建实验记录和对应的运行目录"""
    project_id = mock_project()
    exp_id, path = mock_experiment_with_folder(project_id)
    assert exp_id == 1
    assert os.path.exists(path)
