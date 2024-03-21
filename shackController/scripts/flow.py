import time
import RPi.GPIO as GPIO


class FlowSensor:
    """
    The FlowSensor class represents a flow sensor that measures the flow rate of a liquid.
    It provides methods to count pulses and calculate the flow rate based on the count value.

    Attributes:
        pin: The GPIO pin number to which the flow sensor is connected.
        logger: The logger object for logging messages.
        count: The number of pulses counted by the sensor.
        start_counter: A boolean value indicating whether the counter is active.
        flow: The flow rate calculated based on the count value.

    Methods:
        count_pulse: Increments the count and calculates flow based on the count.
        setup: Configures a GPIO pin for input with a pull-up resistor and adds an event detection.
        get_flow: Calculates the flow rate based on a count value and a time delay.
    """

    def __init__(self, pin, logger):
        self.logger = logger
        self.pin = pin
        self.count = 0
        self.start_counter = False
        self.flow = 0
        self.setup()

    def count_pulse(self, channel):
        """
        The function `count_pulse` increments a count and calculates flow based on the count.
        """
        if self.start_counter:
            self.count = self.count + 1
            self.flow = self.count / (60 * 7.5)
            self.logger.info(f"Flow rate: {self.flow} L/min")

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
