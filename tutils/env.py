import os

__test_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "test")

TEMP_PATH = os.path.join(__test_path, "temp")

TEST_DIR = "swanboard-test"


def get_test_path():
    return os.path.join(TEMP_PATH, TEST_DIR)
