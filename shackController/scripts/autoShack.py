#!/usr/bin/env python3
from logging.handlers import TimedRotatingFileHandler
from operator import truediv
from humidityTempSensor import HumidityTempSensor
import board
from pump import Pump
from flow import FlowSensor
from sqlDatabase import Database
import time
from datetime import datetime
import os
import logging
from pythonjsonlogger import jsonlogger
from configData import ConfigData


class AutoShack:
    def __init__(self):
        #  set up some basic logging... look in the shack.log file for details
        #  of an execution of the program.
        self.ROOT_DIR = os.path.realpath(
            os.path.join(os.path.dirname(__file__), '..'))
        self.logger = logging.getLogger(
            "Autoshack rotating human readable log")
        self.logger.setLevel(logging.INFO)
        self.datalogger = logging.getLogger("Autoshack data log")
        self.datalogger.setLevel(logging.INFO)
        # rotate the logs once a day, and keep 5 versions
        handler = TimedRotatingFileHandler(self.ROOT_DIR+'/logs/shack.log',
                                           when='D',
                                           interval=1,
                                           backupCount=5)
        # rotate the logs once a day, and keep 5 versions
        datahandler = TimedRotatingFileHandler(self.ROOT_DIR+'/logs/shackdata.log',
                                               when='D',
                                               interval=1,
                                               backupCount=5)
        formatter = logging.Formatter('%(asctime)s - %(message)s')
        dataformatter = jsonlogger.JsonFormatter()
        handler.setFormatter(formatter)
        datahandler.setFormatter(dataformatter)
        self.logger.addHandler(handler)
        self.datalogger.addHandler(datahandler)
        self.logger.info("Begin AutoShack")

        self.desiredPumpStateOn = False
        self.tempHumiditySensor = HumidityTempSensor(board.D4, self.logger)
        self.flowSensor = FlowSensor(23, self.logger)
        self.pump = Pump(18, self.logger)
        self.pump_status = 'unchanged'
        self.db = Database()
        self.config = ConfigData()

    def setPumpState(self, pumpState):
        if pumpState and self.flowSensor.flow == 0:
            # Pump should be on but no flow -> turn it ON
            self.pump.pumpOn()
            self.logger.info("Pump turned ON")
            self.pump_status = "ON"
            # Pump should not be on but flow -> turn OFF
        elif (not pumpState) and self.flowSensor.flow > 0:
            self.pump.pumpOff()
            self.logger.info("Pump turned OFF")
            self.pump_status = "OFF"
        else:
            self.logger.info("Pump unchanged")
            self.pump_status = "unchanged"

    # This method calls the functions to get the various readings
    # Temp and Humidity + flow are currently collected.  more can be added later.

    def getReadings(self):
        self.tempHumiditySensor.getReading()
        self.flowSensor.getFlow()


def main():
    # Initialize the AutoShaq
    A1 = AutoShack()
    data = []
    try:
        while (True):
            # Every Minute
            if (datetime.now().second == 0):
                # average over 1 minute
                A1.getReadings()

                # Get the temp, humidity and flow rate
                A1.logger.info('Humidity (%)           :' +
                               str(A1.tempHumiditySensor.humidity))
                A1.logger.info('Temperature (F)        :' +
                               str(A1.tempHumiditySensor.temperature))
                A1.logger.info('Flow Rate  (Liter/min) :' +
                               str(A1.flowSensor.flow))

                # Get the confifuation file and see if pump should be on
                A1.config.getConfigurationDataFromDB()
                A1.config.setDesiredPumpState()

                # Turn the pump ON or OFF depending on configuration and current flow
                A1.setPumpState(A1.config.desiredPumpStateOn)
                data = {
                    'datetime': datetime.now(),
                    'humidity': A1.tempHumiditySensor.humidity,
                    'temperature': A1.tempHumiditySensor.temperature,
                    'flow_rate': A1.flowSensor.flow,
                    'pump_status': A1.pump_status,
                }
                #A1.db.insertData(data)
                A1.datalogger.info(data)
                # wait so that we don't loop inside a second
                time.sleep(1)

    except KeyboardInterrupt:
        pass

    return A1


if __name__ == "__main__":
    import time
    s = time.perf_counter()
    A1 = main()
    elapsed = time.perf_counter() - s
    A1.logger.info(f"{__file__} executed in {elapsed:0.2f} seconds.")
    A1.logger.info("End AutoShack")
