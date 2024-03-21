import os
import time
import json
import logging
from datetime import datetime
from dotenv import load_dotenv
import mysql.connector
from sqlDatabase import Database
from logging.handlers import TimedRotatingFileHandler

load_dotenv()


class ConfigData:
    """
    The `ConfigData` class is used to retrieve configuration data from a database or a JSON file.

    Attributes:
        schedule_data (list): A list of dictionaries containing the configuration data.
        desired_pump_state_on (bool): A boolean that indicates whether the pump should be on.
        database (Database): An instance of the `Database` class.
        logger (Logger): An instance of the `Logger` class.

    Methods:
        parse_configuration_data: Parses the configuration data and returns a list of dictionaries.
        get_configuration_data_from_db: Retrieves configuration data from the database.
        get_configuration_data_from_file: Retrieves the configuration data from a JSON file.
        set_desired_pump_state: Sets the desired pump state to on based on a schedule defined in the `schedule_data`.
    """

    def __init__(self, database, logger):
        self.schedule_data = []
        self.desired_pump_state_on = False
        self.database = database
        self.logger = logger

    def parse_configuration_data(self, data):
        """
        Parses the configuration data and returns a list of dictionaries.

        Args:
            data (list): The configuration data to be parsed.

        Returns:
            list: A list of dictionaries containing the parsed configuration data. Each dictionary
            contains the following keys:
                - id: The ID of the configuration.
                - start_hour: The starting hour of the configuration (as an integer).
                - duration: The duration of the configuration (as an integer).
        """
        parsed_config_data = []
        for line in data:
            parsed_config_data.append(
                {
                    "id": line[0],
                    "start_hour": int(line[1]),
                    "duration": int(line[2]),
                }
            )
        return parsed_config_data

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
        self.desired_pump_state_on = False
        query = "SELECT * FROM shackSchedule"
        try:
            data = self.database.query_data(query)
            if data:
                self.schedule_data = self.parse_configuration_data(data)
        except mysql.connector.Error as e:
            self.logger.error(f"Error retrieving configuration data from database: {e}")
            self.get_configuration_data_from_file()

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
    s = time.perf_counter()  # Start timer

    # Set up logging
    root_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), ".."))
    log = logging.getLogger("ConfigData")
    log.setLevel(logging.INFO)
    handler = TimedRotatingFileHandler(
        os.path.join(root_dir, "logs", "configdata.log"),
        when="D",
        interval=1,
        backupCount=5,
    )
    handler.setFormatter(logging.Formatter("%(asctime)s - %(message)s"))
    log.addHandler(handler)
    log.info("Begin AutoShack")
    db = Database()

    config_data = ConfigData(db, log)
    config_data.get_configuration_data_from_db()
    config_data.set_desired_pump_state()

    elapsed = time.perf_counter() - s  # End timer

    print(config_data.schedule_data)
    print(config_data.desired_pump_state_on)
    print(f"{__file__} executed in {elapsed:0.2f} seconds.")
    print("End AutoShack")
