import os

__test_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "test")

TEMP_PATH = os.path.join(__test_path, "temp")

TEST_DIR = "swanboard-test"

TEST_PATH = os.path.join(TEMP_PATH, TEST_DIR)

# 测试时设置 SWANLAB_LOG_DIR，将 swankit 中 get_swanlog_dir 函数的返回值定向到测试目录
os.environ["SWANLAB_LOG_DIR"] = TEST_PATH
