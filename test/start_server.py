from swanboard import SwanBoardRun
from swankit.env import SwanLabSharedEnv
import os

_ = os.path.join(os.path.dirname(os.path.dirname(__file__)), "playground", "swanlog")
os.environ[SwanLabSharedEnv.SWANLOG_FOLDER.value] = _

if __name__ == "__main__":
    SwanBoardRun().run(path=_, host="127.0.0.1", port=6092)
