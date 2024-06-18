from swanboard.db import connect
from tutils import create_private_db


class TestConnectDB:

    def test_connect_db(self):
        db_path = create_private_db()
