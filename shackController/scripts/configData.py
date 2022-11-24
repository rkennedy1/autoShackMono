import time
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()


def getConfigurationDataFromDB():
    db = mysql.connector.connect(
        host=os.getenv('MYSQL_HOST'),
        user=os.getenv('MYSQL_USER'),
        password=os.getenv('MYSQL_PASSWORD'),
        database=os.getenv('MYSQL_DATABASE')
    )
    cursor = db.cursor()
    desiredPumpStateOn = False

    cursor.execute('SELECT * FROM shackSchedule')
    data = cursor.fetchall()
    configurationData = []
    for line in data:
        configurationData.append(
            {'id': line[0], 'startHour': line[1], 'duration': line[2]})
    print(configurationData)
    return (configurationData)


if __name__ == "__main__":
    s = time.perf_counter()
    elapsed = time.perf_counter() - s
    getConfigurationDataFromDB()
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
    print("End AutoShack")
