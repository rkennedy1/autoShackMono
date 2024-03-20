import os
import time
import json
from datetime import datetime
from dotenv import load_dotenv
import mysql.connector

load_dotenv()


class ConfigData:
    def __init__(self):
        self.schedule_data = []
        self.desired_pump_state_on = False

    def get_configuration_data_from_db(self):
        """
        Retrieves configuration data from the database.

        Returns:
            list: A list of dictionaries containing the configuration data.
                  Each dictionary represents a row from the 'shackSchedule' table
                  and contains the following keys:
                  - 'id': The ID of the schedule entry.
                  - 'start_hour': The starting hour of the schedule entry.
                  - 'duration': The duration of the schedule entry.
        """
        database = mysql.connector.connect(
            host=os.getenv("MYSQL_HOST"),
            user=os.getenv("MYSQL_USER"),
            password=os.getenv("MYSQL_PASSWORD"),
            database=os.getenv("MYSQL_DATABASE"),
        )
        cursor = database.cursor()
        self.desired_pump_state_on = False

        cursor.execute("SELECT * FROM shackSchedule")
        data = cursor.fetchall()
        configuration_data = []

        for line in data:
            configuration_data.append(
                {"id": line[0], "start_hour": int(line[1]), "duration": int(line[2])}
            )

        self.schedule_data = configuration_data

    def get_configuration_data_from_file(self):
        """
        Retrieves the configuration data from a JSON file.

        Returns:
            list: The configuration data retrieved from the file.
        """
        self.desired_pump_state_on = False
        configuration_data = []

        config_file_path = os.path.join(
            os.path.dirname(__file__), "..", "shack.config.json"
        )

        with open(config_file_path, encoding="utf-8") as file:
            configuration_data = json.load(file)

        self.schedule_data = configuration_data.get("events", [])

    def set_desired_pump_state(self):
        """
        This function sets the desired pump state to on based on a schedule defined in the
        `schedule_data`.
        """
        for item in self.schedule_data:
            cur_time = datetime.now()
            start_time = cur_time.replace(hour=item["start_hour"], minute=0)
            end_time = start_time.replace(minute=item["duration"])
            if start_time <= cur_time < end_time:
                self.desired_pump_state_on = True


if __name__ == "__main__":
    s = time.perf_counter()
    config_data = ConfigData()
    config_data.get_configuration_data_from_db()
    config_data.set_desired_pump_state()
    elapsed = time.perf_counter() - s

    print(config_data.schedule_data)
    print(config_data.desired_pump_state_on)
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
    print("End AutoShack")
