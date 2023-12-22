# import board
import DHT
import time
import pigpio


class HumidityTempSensor:
    def __init__(self, pin, logger):
        self.pin = pin
        self.sensor = DHT.sensor(pigpio.pi(), pin, model=2)
        self.humidity, self.temperature = 0, 0
        self.logger = logger

        # signal.signal(signal.SIGALRM, handler)
        # signal.alarm(15) #Set the parameter to the amount of seconds you want to wait

    def getReading(self):
        tries = 5
        while tries:
            try:
                timestamp, gpio, status, temperature, humidity = self.sensor.read()
                # get temp/humidy readings and
                if status == DHT.DHT_TIMEOUT:  # no response from sensor
                    print("NO RESPONSE FROM SENSOR")
                    raise RuntimeError
                if status == DHT.DHT_GOOD:
                    print(timestamp + gpio)
                    print("temp: " + temperature)
                    print("humidity: " + humidity)
                time.sleep(2)
                tries -= 1
            except KeyboardInterrupt:
                break
