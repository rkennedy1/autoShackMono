#!/usr/bin/env python3
from logging.handlers import TimedRotatingFileHandler
from operator import truediv
from humidityTempSensor import HumidityTempSensor
# from shackPubSub import shackPubSub
import board
from pump import Pump
from flow import FlowSensor
from sqlDatabase import Database
import time
import json
from datetime import datetime
import os
import logging
from pythonjsonlogger import jsonlogger
import argparse
from configData import configData


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
        # self.shackPubSub = shackPubSub(messageHandler=self.messageHandler)
        # self.shackPubSub.subscribeTopic('autoshack')

    # def messageHandler(self, topic, payload):
    #     payload = json.loads(payload)
    #     print('topic1231312: ', topic, ' msg: ', payload)
    #     if payload['type'] == 'getConfig':
    #         configurationData = []
    #         with open(self.ROOT_DIR+'/shack.config.json') as f:
    #             configurationData = json.load(f)
    #             f.close()
    #         self.shackPubSub.publishMessage(
    #             {'type': 'publishConfig', 'payload': configurationData})
    #     elif payload['type'] == 'putConfig':
    #         with open(self.ROOT_DIR+'/shack.config.json', 'w') as f:
    #             f.write(json.dumps(payload['payload']))
    #             f.close()

    # def getConfigurationDataFromFile(self):
    #     self.desiredPumpStateOn = False
    #     configurationData = []
    #     # get the current directory so that we can get the configuration file

    #     with open(self.ROOT_DIR+'/shack.config.json') as f:
    #         configurationData = json.load(f)
    #         f.close()
    #     for configurationItem in configurationData["events"]:
    #         # initialize start time with current time to get the data component
    #         curTime = datetime.now()
    #         start_time = curTime
    #         start_time = start_time.replace(
    #             hour=configurationItem["start_hour"], minute=configurationItem["start_minute"])
    #         # initialize end time with current time to get the data component
    #         duration = configurationItem["duration"]
    #         end_time = start_time
    #         end_time = end_time.replace(minute=start_time.minute+duration)
    #         if start_time <= curTime < end_time:
    #             self.desiredPumpStateOn = True

    # This function sets the pump state based on the values in
    # self.desiredPumStateOn  and self.FlowSensor.flow

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
                config = configData()
                config.getConfigurationDataFromDB()
                config.setDesiredPumpState

                # Turn the pump ON or OFF depending on configuration and current flow
                A1.setPumpState(config.desiredPumpStateOn)
                data = {
                    'datetime': datetime.now(),
                    'humidity': A1.tempHumiditySensor.humidity,
                    'temperature': A1.tempHumiditySensor.temperature,
                    'flow_rate': A1.flowSensor.flow,
                    'pump_status': A1.pump_status,
                }
                A1.db.insertData(data)
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
