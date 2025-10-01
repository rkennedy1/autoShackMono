#!/usr/bin/env python3
"""
AutoShack Controller Module

This module provides the main AutoShack controller that manages:
- Temperature and humidity monitoring
- Water flow measurement and tracking
- Pump control
- Database logging
- Configuration management

The controller runs continuously, taking measurements every minute and
storing data to a database for analysis and monitoring.
"""
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

        # Initialize components (grouped to reduce attribute count)
        self._sensors = {
            "temp_humidity": HumidityTempSensor(27, self.logger),
            "flow": FlowSensor(23, self.logger),
        }
        self._hardware = {
            "pump": Pump(18, self.logger),
            "pump_status": "unchanged",
        }
        self._data = {
            "database": Database(self.logger),
        }
        self._data["config"] = ConfigData(self._data["database"], self.logger)

        # Flow measurement tracking
        self._flow_tracking = {
            "last_measurement": None,
            "measurement_count": 0,
        }

    def set_pump(self, pump_state):
        """
        Set the state of the pump based on the given pump_state.

        Args:
            pump_state (bool): The desired state of the pump.
        """
        if pump_state:
            self._hardware["pump"].pump_on()
            self.logger.info("Pump turned ON")
            self._hardware["pump_status"] = "ON"
        else:
            self._hardware["pump"].pump_off()
            self.logger.info("Pump turned OFF")
            self._hardware["pump_status"] = "OFF"

    def get_last_flow_measurement(self):
        """Get the last flow measurement data safely."""
        return self._flow_tracking.get("last_measurement")

    def _get_flow_measurement_count(self):
        """Get the flow measurement count safely."""
        return self._flow_tracking.get("measurement_count", 0)

    @property
    def temp_humidity_sensor(self):
        """Access to temperature/humidity sensor."""
        return self._sensors["temp_humidity"]

    @property
    def flow_sensor(self):
        """Access to flow sensor."""
        return self._sensors["flow"]

    @property
    def pump_status(self):
        """Access to pump status."""
        return self._hardware["pump_status"]

    @property
    def database(self):
        """Access to database."""
        return self._data["database"]

    @property
    def config(self):
        """Access to config."""
        return self._data["config"]

    def prepare_data_for_logging(self):
        """Prepare data structure for database logging."""
        flow_data = self.get_last_flow_measurement()
        if flow_data:
            return {
                "datetime": datetime.now(),
                "humidity": self.temp_humidity_sensor.humidity,
                "temperature": self.temp_humidity_sensor.temperature,
                "flow_rate": flow_data["flow_rate_lpm"],
                "pump_status": self.pump_status,
            }
        # Fallback to basic data structure
        return {
            "datetime": datetime.now(),
            "humidity": self.temp_humidity_sensor.humidity,
            "temperature": self.temp_humidity_sensor.temperature,
            "flow_rate": self.flow_sensor.flow,
            "pump_status": self.pump_status,
        }

    def get_readings(self):
        """
        Get the readings from the temperature/humidity sensor and flow sensor.
        Uses enhanced flow measurement with validation.
        """
        self._sensors["temp_humidity"].get_reading()

        # Enhanced flow measurement with validation
        try:
            # Use averaged flow measurement for better accuracy
            flow_rate = self._sensors["flow"].get_flow_averaged(
                measurement_duration=3.0, num_samples=3
            )

            # Store measurement data
            self._flow_tracking["last_measurement"] = {
                "flow_rate_lpm": flow_rate,
                "timestamp": datetime.now(),
            }

            self._flow_tracking["measurement_count"] += 1

            # Log flow information
            self.logger.info(
                "Flow measurement #%d: %.3f L/min",
                self._flow_tracking["measurement_count"],
                flow_rate,
            )

        except (ValueError, ZeroDivisionError, RuntimeError) as flow_error:
            self.logger.error("Flow measurement error: %s", flow_error)
            # Fallback to basic measurement
            self._sensors["flow"].get_flow()
            self._flow_tracking["last_measurement"] = {
                "flow_rate_lpm": self._sensors["flow"].flow,
                "timestamp": datetime.now(),
                "error": str(flow_error),
            }


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

                # Enhanced flow logging
                flow_data = auto_shack.get_last_flow_measurement()
                if flow_data:
                    auto_shack.logger.info(
                        "Flow Rate: %.3f L/min",
                        flow_data["flow_rate_lpm"],
                    )
                    if "error" in flow_data:
                        auto_shack.logger.warning(
                            "Flow measurement had errors: %s", flow_data["error"]
                        )
                else:
                    auto_shack.logger.info(
                        "Flow Rate (Liter/min): %s", auto_shack.flow_sensor.flow
                    )

                if auto_shack.database.connected:
                    try:
                        auto_shack.config.get_configuration_data_from_db()
                    except mysql.connector.Error as err:
                        auto_shack.logger.info("Database error")
                        auto_shack.logger.info(err)
                        auto_shack.config.get_configuration_data_from_db()
                else:
                    auto_shack.database.reconnect()
                    auto_shack.config.get_configuration_data_from_file()

                auto_shack.config.set_desired_pump_state()
                auto_shack.set_pump(auto_shack.config.desired_pump_state_on)

                # Prepare data with enhanced flow information
                data = auto_shack.prepare_data_for_logging()

                if auto_shack.database.connected:
                    try:
                        auto_shack.database.insert_shack_data(data)
                    except mysql.connector.Error as err:
                        auto_shack.logger.info("Database error")
                        auto_shack.logger.info(err)
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
