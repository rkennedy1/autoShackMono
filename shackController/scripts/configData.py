import time
import mysql.connector
import os
from dotenv import load_dotenv
from datetime import datetime
import json
load_dotenv()


class ConfigData:
    def __init__(self):
        self.scheduleData = []
        desiredPumpStateOn = False

    def getConfigurationDataFromDB(self):
        db = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            user=os.getenv('MYSQL_USER'),
            password=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )
        cursor = db.cursor()
        self.desiredPumpStateOn = False

        cursor.execute('SELECT * FROM shackSchedule')
        data = cursor.fetchall()
        configurationData = []
        for line in data:
            configurationData.append(
                {'id': line[0], 'startHour': line[1], 'duration': line[2]})
        self.scheduleData = configurationData
        # print(self.scheduleData)

    def getConfigurationDataFromFile(self):
        self.desiredPumpStateOn = False
        configurationData = []
        # get the current directory so that we can get the configuration file
        with open(os.path.realpath(os.path.join(os.path.dirname(__file__), '..'))+'/shack.config.json') as f:
            configurationData = json.load(f)
            f.close()
        self.scheduleData = configurationData["events"]

    def setDesiredPumpState(self):
        for item in self.scheduleData:
            # initialize start time with current time
            curTime = datetime.now()
            start_time = curTime
            start_time = start_time.replace(
                hour=item["start_hour"], minute=0)
            # initialize end time with start time
            duration = item["duration"]
            end_time = start_time
            end_time = end_time.replace(minute=duration)
            if start_time <= curTime < end_time:
                self.desiredPumpStateOn = True


if __name__ == "__main__":
    s = time.perf_counter()
    elapsed = time.perf_counter() - s
    data = ConfigData()
    data.getConfigurationDataFromDB()
    data.setDesiredPumpState()
    print(data.scheduleData)
    print(data.desiredPumpStateOn)
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
    print("End AutoShack")
