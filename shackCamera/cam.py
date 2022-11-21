import os
import time
import requests
from dotenv import load_dotenv

load_dotenv()

class Cam:
    def __init__(self, timezone='America/Los_Angeles'):
        self.timezone = timezone
        self.fileName = self.generateFileName()

    def generateFileName(self):
        os.environ['TZ'] = self.timezone
        time.tzset()
        return time.strftime('%Y-%m-%dT%H:%M:%SZ')


    def takePicture(self):
        os.system("libcamera-still -t 5000 --viewfinder-width 2312 --viewfinder-height 1736 --width 4624 --height 3472 -o ~/autoShackMono/shackCamera/pics/{} --autofocus".format(self.fileName))
        return


    def pushPicture(self):
        os.system("scp ~/autoShackMono/shackCamera/pics/{} ryan@guestserver.local:~/autoShackMono/shackServer/images/{}".format(self.fileName, self.fileName))
        url = 'http://guestserver.local:3001/lastPicture'
        requests.post(url, data={'fileName': self.fileName}, timeout=5)
        return

    def main(self):
        print("start")

        self.fileName = self.generateFileName()+'.jpg'
        print("Picture will be named: " + self.fileName)

        self.takePicture()
        print("picture taken")

        self.pushPicture()
        print("picture sent to autoshack")

        print("done")
        return self.fileName


if __name__ == "__main__":
    cam = Cam()
    cam.main()
