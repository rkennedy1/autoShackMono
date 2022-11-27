import RPi.GPIO as GPIO
import time


class FlowSensor:
    def __init__(self, pin, logger):
        self.logger = logger
        self.pin = pin
        self.count = 0
        self.start_counter = False
        self.flow = 0
        self.setup()

    def countPulse(self, channel):
        if self.start_counter:
            self.count = self.count+1
            self.flow = self.count / (60 * 7.5)

    def setup(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(self.pin, GPIO.FALLING, callback=self.countPulse)

    def getFlow(self):
        self.start_counter = True
        time.sleep(1)
        self.start_counter = False
        self.flow = (self.count * 60 * 2.25 / 1000)
        self.count = 0
