import json
import os
from dotenv import load_dotenv
import pymysql as MySQLdb

load_dotenv()
ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), ".."))


class Database:
    """
    The `Database` class is used to connect to a MySQL database and insert data into a table called `shacklog`.

    Attributes:
        db: The `db` attribute is an instance of the `MySQLdb` class that is used to connect to the MySQL database.
        cursor: The `cursor` attribute is an instance of the `MySQLdb` class that is used to execute SQL queries.
        connected: The `connected` attribute is a boolean that indicates whether the database is connected.

    Methods:
        insert_shack_data: The `insert_shack_data` function inserts data into a MySQL database table called `shacklog`.
        query_data: The `query_data` function queries data from a MySQL database table called `shacklog`.
    """

    def __init__(self):

        try:
            self.db = MySQLdb.connect(
                host=os.getenv("MYSQL_HOST"),
                user=os.getenv("MYSQL_USER"),
                password=os.getenv("MYSQL_PASSWORD"),
                database=os.getenv("MYSQL_DATABASE"),
            )
            self.cursor = self.db.cursor()
            self.connected = True
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            self.connected = False
            print(e)
            return None

    def insert_shack_data(self, data):
        """
        The `insert_data` function inserts data into a MySQL database table called `shacklog`.

        :param data: Includes datetime, humidity, temperature, flow rate, pump status, and execution time.
        """
        try:
            sql = (
                f"INSERT INTO shacklog (datetime, humidity, temperature, flow_rate, pump_status, execution_time)"
                f" VALUES (\"{data['datetime']}\", {data['humidity']}, {data['temperature']}, {data['flow_rate']}, \"{data['pump_status']}\", 0)"
            )
            self.cursor.execute(sql)
            self.db.commit()
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            print("Insert data error")
            print(e)

    def query_data(self, query):
        """
        The `query_data` function queries data from a MySQL database table called `shacklog`.

        :param query: The SQL query to be executed.
        """
        try:
            self.cursor.execute(query)
            return self.cursor.fetchall()
        except (MySQLdb.Error, MySQLdb.Warning) as e:
            print("Query data error")
            print(e)


def main():
    lines = []
    entries = []
    with open(ROOT_DIR + "/logs/shackdata.log") as f:
        lines = f.readlines()

    lastAdd = []
    with open(ROOT_DIR + "/logs/lastAdd.txt", "r") as f:
        lastAdd = f.readlines()
        if not lastAdd:
            lastAdd.append("000")

    for line in lines:
        jsonline = json.loads(line)
        if jsonline["datetime"] > lastAdd[0]:
            entries.append(jsonline)

    if entries:
        with open(ROOT_DIR + "/logs/lastAdd.txt", "w") as f:
            f.write(entries[-1]["datetime"])

    if len(entries) != 0:
        print(entries)
        D1 = Database()
        for entry in entries:
            D1.insert_shack_data(entry)

        print("Added ", len(entries), " entries to the database")
    else:
        print("Failed to add data to the database")


if __name__ == "__main__":
    main()
