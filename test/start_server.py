import os
import uvicorn
from swanboard.app import app
from swanboard.db import connect
from swanboard.utils import FONT

path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "swanlog")
connect(path=path)
HOST = "0.0.0.0"
PORT = 6092


def main():
    return app


if __name__ == "__main__":
    print("Try to explore the swanlab experiment logs in: \n")
    print("               --> " + FONT.dark_green("http://127.0.0.1:" + str(PORT)))
    print("\n")
    uvicorn.run("start_server:main", host=HOST, port=PORT, reload=True, log_level="critical")
