import RPi.GPIO as GPIO
import time
import asyncio
import logging


class Pump:
    def __init__(self, pin, logger):
        self.logger = logger
        self.pin = pin
        self.setup()

    def setup(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.pin, GPIO.OUT)

    def pumpOn(self):
        GPIO.output(self.pin, GPIO.HIGH)

    def pumpOff(self):
        GPIO.output(self.pin, GPIO.LOW)

    async def runPump(self, duration):
        logging.info("PUMP ON")
        self.pumpOn()
        for i in range(duration):
            self.logger.info('.', end=" ", flush=True)
            await asyncio.sleep(1)
        
        self.logger.info("PUMP OFF")
        self.pumpOff()
