import os
from dotenv import load_dotenv
import mysql.connector
import json

load_dotenv()
ROOT_DIR = os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))


class Database():
    def __init__(self):
        self.db = mysql.connector.connect(
          host=os.getenv('MYSQL_HOST'),
          user=os.getenv('MYSQL_USER'),
          password=os.getenv('MYSQL_PASSWORD'),
          database=os.getenv('MYSQL_DATABASE')
        )
        self.cursor = self.db.cursor()

    def insertData(self, data):
        sql = (
        f"INSERT INTO shacklog (datetime, humidity, temperature, flow_rate, pump_status, execution_time)"
        f" VALUES (\"{data['datetime']}\", {data['humidity']}, {data['temperature']}, {data['flow_rate']}, \"{data['pump_status']}\", 0)"
        #f"ON DUPLICATE KEY UPDATE datetime={data['datetime']},humidity={data['humidity']},temperature={data['temperature']}, flow_rate={data['flow_rate']}, pump_status={data['pump_status']}"
        )
#        print(sql)
        self.cursor.execute(sql)
        self.db.commit()
#        print(data)

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
