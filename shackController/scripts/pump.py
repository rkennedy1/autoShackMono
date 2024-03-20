import logging
import asyncio
import RPi.GPIO as GPIO


class Pump:
    """
    A class representing a pump.
    """

    def __init__(self, pin, logger):
        self.logger = logger
        self.pin = pin
        self.setup()

    def setup(self):
        """
        The setup function initializes GPIO pins for output in BCM mode with warnings disabled.
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.pin, GPIO.OUT)

    def pump_on(self):
        """
        The `pumpOn` function turns on a pump by setting the GPIO pin to HIGH.
        """
        GPIO.output(self.pin, GPIO.HIGH)

    def pump_off(self):
        """
        The `pumpOff` function turns off a GPIO pin by setting it to LOW.
        """
        GPIO.output(self.pin, GPIO.LOW)

    async def run_pump(self, duration):
        """
        The `runPump` function turns on a pump for a specified duration and then turns it off.

        :param duration: The `duration` parameter in the `runPump` method represents the amount of time,
        in seconds, for which the pump will be running. During this duration, the pump will be turned
        on, and the method will log a dot (".") every second to indicate that the pump is still running.
        """
        logging.info("PUMP ON")
        self.pump_on()
        for _ in range(duration):
            self.logger.info(".", end=" ", flush=True)
            await asyncio.sleep(1)

        self.logger.info("PUMP OFF")
        self.pump_off()
