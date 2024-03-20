from pigpio_dht import DHT22


class HumidityTempSensor:
    """
    A class representing a humidity and temperature sensor.
    """

    def __init__(self, pin, logger):
        self.sensor = DHT22(pin)
        self.humidity, self.temperature = 0, 0
        self.logger = logger

        # signal.signal(signal.SIGALRM, handler)
        # signal.alarm(15) #Set the parameter to the amount of seconds you want to wait

    def get_reading(self):
        """
        This Python function attempts to read temperature and humidity data from a sensor, handling
        timeouts and displaying error messages if necessary.
        """
        try:
            self.humidity, self.temperature = 0, 0
            result = self.sensor.sample(samples=5)
        except TimeoutError:
            self.logger.info("Temp/Humidity sensor timed out")

        if result["valid"]:
            self.temperature = result["temp_f"]
            self.humidity = result["humidity"]
            print(result)
        else:
            print("error reading DHT22 sensor")
