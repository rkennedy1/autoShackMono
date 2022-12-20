import os
from dotenv import load_dotenv
from MySQLdb import _mysql
import json

load_dotenv()
ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))


class Database():
    def __init__(self):
        try:
            self.db = _mysql.connector.connect(
                host=os.getenv('MYSQL_HOST'),
                user=os.getenv('MYSQL_USER'),
                password=os.getenv('MYSQL_PASSWORD'),
                database=os.getenv('MYSQL_DATABASE')
            )
            self.cursor = self.db.cursor()
        except (_mysql.Error, _mysql.Warning) as e:
            print(e)
            return None

    def insertData(self, data):
        sql = (
            f"INSERT INTO shacklog (datetime, humidity, temperature, flow_rate, pump_status, execution_time)"
            f" VALUES (\"{data['datetime']}\", {data['humidity']}, {data['temperature']}, {data['flow_rate']}, \"{data['pump_status']}\", 0)"
        )
        self.cursor.execute(sql)
        self.db.commit()


def main():
    lines = []
    entries = []
    with open(ROOT_DIR + '/logs/shackdata.log') as f:
        lines = f.readlines()

    lastAdd = []
    with open(ROOT_DIR + '/logs/lastAdd.txt', 'r') as f:
        lastAdd = f.readlines()
        if not lastAdd:
            lastAdd.append('000')

    for line in lines:
        jsonline = json.loads(line)
        if jsonline['datetime'] > lastAdd[0]:
            entries.append(jsonline)

    if entries:
        with open(ROOT_DIR + '/logs/lastAdd.txt', 'w') as f:
            f.write(entries[-1]['datetime'])

    if len(entries) != 0:
        print(entries)
        D1 = Database()
        for entry in entries:
            D1.insertData(entry)

        print("Added ", len(entries), " entries to the database")
    else:
        print("Failed to add data to the database")


if __name__ == "__main__":
    main()
