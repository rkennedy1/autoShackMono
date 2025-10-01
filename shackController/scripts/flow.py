"""
Flow sensor module for measuring water flow rate using a hall-effect flow sensor.

This module provides the FlowSensor class for interfacing with flow sensors that
output pulse signals proportional to flow rate. The sensor specification is:
F = 38 * Q ± 3% (where F = frequency in pulses/min, Q = flow rate in L/min)
"""

import time
from RPi import GPIO


class FlowSensor:
    """
    The FlowSensor class represents a flow sensor that measures the flow rate of a liquid.
    It provides methods to count pulses and calculate the flow rate based on the count value.

    Flow Sensor Specifications:
    - Formula: F = 38 * Q ± 3% (where F = frequency in pulses/min, Q = flow rate in L/min)
    - Working range: 0.3-6 L/min
    - Error: ±3%
    - This means: Q = F / 38 (flow rate in L/min)

    Attributes:
        pin: The GPIO pin number to which the flow sensor is connected.
        logger: The logger object for logging messages.
        count: The number of pulses counted by the sensor.
        start_counter: A boolean value indicating whether the counter is active.
        flow: The flow rate calculated based on the count value (L/min).
        pulses_per_liter: Number of pulses per liter (38 pulses per L/min).
    """

    def __init__(self, pin, logger):
        self.logger = logger
        self.pin = pin
        self.count = 0
        self.start_counter = False
        self.flow = 0
        # Flow sensor specification: 38 pulses per L/min
        self.pulses_per_liter_per_minute = 38
        self.setup()

    def count_pulse(self, channel):  # pylint: disable=unused-argument
        """
        The function `count_pulse` increments a count when the counter is active.
        Real-time flow calculation is not performed here to avoid performance issues.

        Args:
            channel: GPIO channel (unused but required by GPIO callback)
        """
        if self.start_counter:
            self.count = self.count + 1

    def setup(self):
        """
        The setup function configures a GPIO pin for input with a pull-up resistor and adds an event
        detection for a falling edge trigger.
        """
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)
        GPIO.add_event_detect(self.pin, GPIO.FALLING, callback=self.count_pulse)

    def get_flow(self, measurement_duration=1.0):
        """
        Calculate flow rate based on pulse count over a specified duration.

        Args:
            measurement_duration (float): Duration in seconds to measure flow (default: 1.0)

        Returns:
            float: Flow rate in L/min

        Formula:
        - Sensor specification: F = 38 * Q ± 3%
        - Therefore: Q = F / 38
        - Where F = pulses per minute, Q = flow rate in L/min
        """
        self.count = 0
        self.start_counter = True

        # Measure for the specified duration
        time.sleep(measurement_duration)

        self.start_counter = False

        # Calculate flow rate: pulses per second * 60 / pulses per liter per minute
        pulses_per_second = self.count / measurement_duration
        pulses_per_minute = pulses_per_second * 60

        # Apply the sensor formula: Q = F / 38
        self.flow = pulses_per_minute / self.pulses_per_liter_per_minute

        # Validate flow rate is within sensor range (0.3-6 L/min)
        if self.flow < 0.3:
            msg = f"Flow rate {self.flow:.3f} L/min is below minimum range (0.3 L/min)"
            self.logger.warning(msg)
        elif self.flow > 6.0:
            msg = f"Flow rate {self.flow:.3f} L/min exceeds maximum range (6.0 L/min)"
            self.logger.warning(msg)

        msg = (
            f"Flow measurement: {self.count} pulses in {measurement_duration}s = "
            f"{self.flow:.3f} L/min"
        )
        self.logger.info(msg)

        return self.flow

    def get_flow_averaged(self, measurement_duration=5.0, num_samples=5):
        """
        Get a more accurate flow rate by taking multiple samples and averaging.

        Args:
            measurement_duration (float): Duration in seconds for each measurement
            num_samples (int): Number of samples to take and average

        Returns:
            float: Averaged flow rate in L/min
        """
        flow_rates = []

        for i in range(num_samples):
            flow_rate = self.get_flow(measurement_duration)
            flow_rates.append(flow_rate)
            self.logger.debug(f"Sample {i+1}/{num_samples}: {flow_rate:.3f} L/min")

        # Calculate average, excluding outliers
        if len(flow_rates) > 2:
            # Remove the highest and lowest values to reduce noise
            flow_rates.sort()
            flow_rates = flow_rates[1:-1]  # Remove first and last elements

        average_flow = sum(flow_rates) / len(flow_rates)

        msg = (
            f"Averaged flow rate from {len(flow_rates)} samples: "
            f"{average_flow:.3f} L/min"
        )
        self.logger.info(msg)

        return average_flow
