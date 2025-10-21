#!/usr/bin/env python3
import logging
import os
import time
from datetime import datetime

from logging.handlers import TimedRotatingFileHandler
import mysql.connector


from configData import ConfigData
from flow import FlowSensor
from humidityTempSensor import HumidityTempSensor
from pump import Pump
from sqlDatabase import Database

root_dir = os.path.realpath(os.path.join(os.path.dirname(__file__), ".."))


class AutoShack:
    """
    This class represents the AutoShack controller.
    """

    def __init__(self):
        # Set up logging
        self.logger = logging.getLogger("AutoShack")
        self.logger.setLevel(logging.INFO)
        handler = TimedRotatingFileHandler(
            os.path.join(root_dir, "logs", "shack.log"),
            when="D",
            interval=1,
            backupCount=5,
        )
        handler.setFormatter(logging.Formatter("%(asctime)s - %(message)s"))
        self.logger.addHandler(handler)
        self.logger.info("Begin AutoShack")

        # Initialize components
        self.temp_humidity_sensor = HumidityTempSensor(27, self.logger)
        self.flow_sensor = FlowSensor(23, self.logger)
        self.pump = Pump(18, self.logger)
        self.database = Database(self.logger)
        self.config = ConfigData(self.database, self.logger)
        self.pump_status = "unchanged"

    def set_pump(self, pump_state):
        """
        Set the state of the pump based on the given pump_state.

        Args:
            pump_state (bool): The desired state of the pump.
        """
        if pump_state:
            self.pump.pump_on()
            self.logger.info("Pump turned ON")
            self.pump_status = "ON"
        else:
            self.pump.pump_off()
            self.logger.info("Pump turned OFF")
            self.pump_status = "OFF"

    def get_readings(self):
        """
        Get the readings from the temperature/humidity sensor and flow sensor.
        """
        self.temp_humidity_sensor.get_reading()
        self.flow_sensor.get_flow()


def main():
    """
    Main function for Autoshack
    """
    auto_shack = AutoShack()
    try:
        while True:
            if datetime.now().second == 0:
                auto_shack.get_readings()
                auto_shack.logger.info(
                    "Humidity (%%): %s", auto_shack.temp_humidity_sensor.humidity
                )
                auto_shack.logger.info(
                    "Temperature (F): %s", auto_shack.temp_humidity_sensor.temperature
                )
                auto_shack.logger.info(
                    "Flow Rate (Liter/min): %s", auto_shack.flow_sensor.flow
                )

                if auto_shack.database.connected:
                    try:
                        auto_shack.config.get_configuration_data_from_db()
                    except mysql.connector.Error as err:
                        auto_shack.logger.error(f"Database error: {err}")
                        auto_shack.logger.info("Falling back to JSON configuration file")
                        auto_shack.config.get_configuration_data_from_file()
                else:
                    auto_shack.logger.info("Database not connected, using JSON configuration file")
                    auto_shack.config.get_configuration_data_from_file()

                auto_shack.config.set_desired_pump_state()
                auto_shack.set_pump(auto_shack.config.desired_pump_state_on)

                data = {
                    "datetime": datetime.now(),
                    "humidity": auto_shack.temp_humidity_sensor.humidity,
                    "temperature": auto_shack.temp_humidity_sensor.temperature,
                    "flow_rate": auto_shack.flow_sensor.flow,
                    "pump_status": auto_shack.pump_status,
                }

                if auto_shack.database.connected:
                    try:
                        auto_shack.database.insert_shack_data(data)
                        auto_shack.logger.info("Data successfully inserted into database")
                    except mysql.connector.Error as err:
                        auto_shack.logger.error(f"Database insertion error: {err}")
                        auto_shack.logger.info("Data logging failed, but service continues")
                else:
                    auto_shack.logger.info("Database not connected, data logging skipped")
                
                auto_shack.logger.info(data)
                time.sleep(1)

    except KeyboardInterrupt:
        pass

    return auto_shack


if __name__ == "__main__":
    start_time = time.perf_counter()
    auto_shack_instance = main()
    elapsed_time = time.perf_counter() - start_time
    auto_shack_instance.logger.info(
        "%s executed in %.2f seconds.", __file__, elapsed_time
    )
    auto_shack_instance.logger.info("End AutoShack")
