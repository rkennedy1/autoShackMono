from pigpio_dht import DHT22


class HumidityTempSensor:
    """
    A class representing a humidity and temperature sensor.

    Attributes:
        sensor: The DHT22 sensor object.
        humidity: The current humidity reading.
        temperature: The current temperature reading.
        logger: The logger object for logging messages.

    Methods:
        get_reading: Reads temperature and humidity data from the sensor.
    """

    def __init__(self, pin, logger):
        self.sensor = DHT22(pin)
        self.humidity, self.temperature = 0, 0
        self.logger = logger

    def get_reading(self):
        """
        This Python function attempts to read temperature and humidity data from a sensor, handling
        timeouts and displaying error messages if necessary.
        """
        try:
            self.humidity, self.temperature = 0, 0
            result = self.sensor.sample(samples=5)
            if result["valid"]:
                self.temperature = result["temp_f"]
                self.humidity = result["humidity"]
                print(result)
            else:
                print("error reading DHT22 sensor")
        except TimeoutError:
            self.logger.info("Temp/Humidity sensor timed out") 


       
