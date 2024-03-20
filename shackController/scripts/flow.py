import time
import RPi.GPIO as GPIO


class FlowSensor:
    """
    Represents a flow sensor that counts pulses and calculates flow rate based on the pulse count.
    """

    def __init__(self, pin, logger):
        self.logger = logger
        self.pin = pin
        self.count = 0
        self.start_counter = False
        self.flow = 0
        self.setup()

    def count_pulse(self):
        """
        The function `countPulse` increments a count and calculates flow based on the count.
        """
        if self.start_counter:
            self.count = self.count + 1
            self.flow = self.count / (60 * 7.5)

    def setup(self):
        """
        The setup function configures a GPIO pin for input with a pull-up resistor and adds an event
        detection for a falling edge trigger.
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(self.pin, GPIO.FALLING, callback=self.count_pulse)

    def get_flow(self):
        """
        This function calculates the flow rate based on a count value and a time delay.
        """
        self.start_counter = True
        time.sleep(1)
        self.start_counter = False
        self.flow = self.count * 60 * 2.25 / 1000
        self.count = 0
