# import board
import DHT
import time
from pigpio_dht import DHT22


class HumidityTempSensor:
    def __init__(self, pin, logger):
        self.sensor = DHT22(pin)
        self.humidity, self.temperature = 0, 0
        self.logger = logger

        # signal.signal(signal.SIGALRM, handler)
        # signal.alarm(15) #Set the parameter to the amount of seconds you want to wait

    def getReading(self):
        result = self.sensor.sample(samples=5)
        if result["valid"]:
            self.temperature = result["temp_f"]
            self.humidity = result["humidity"]
            print(result)
        else:
            print("error reading DHT22 sensor")
