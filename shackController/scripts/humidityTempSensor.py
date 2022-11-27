#import board
import adafruit_dht
import time


def handler(signum, frame):
    raise Exception('Action took too much time')


class HumidityTempSensor():
    def __init__(self, pin, logger):
        self.pin = pin
        self.sensor = adafruit_dht.DHT22(self.pin)
        self.humidity, self.temperature = 0, 0
        self.logger = logger

        # signal.signal(signal.SIGALRM, handler)
        # signal.alarm(15) #Set the parameter to the amount of seconds you want to wait

    def getReading(self):
        try:
            # get temp/humidy readings and
            temperature_c = self.sensor.temperature
            self.temperature = temperature_c * (9 / 5) + 32
            self.humidity = self.sensor.humidity

        except RuntimeError as error:
            # Errors happen fairly often, DHT's are hard to read, just keep going
            self.logger.error(error.args[0])
            time.sleep(2.0)
            return
        except Exception as error:
            self.sensor.exit()
            raise error
