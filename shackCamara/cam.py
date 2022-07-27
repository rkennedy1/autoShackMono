import os
import random
import time
import requests


def generateFileName(timezone):
    os.environ['TZ'] = timezone
    time.tzset()
    return time.strftime('%Y-%m-%dT%H:%M:%SZ')


def takePicture(fileName):
    os.system("libcamera-still -t 5000 --viewfinder-width 2312 --viewfinder-height 1736 --width 4624 --height 3472 -o ~/autoShackMono/camera/pics/{}.jpg --autofocus".format(fileName))
    return


def pushPicture(fileName):
    os.system("scp ~/autoShackMono/camera/pics/{}.jpg pi@raspberrypi.local:~/pics/{}.jpg".format(fileName, fileName))
    url = 'raspberrypi.local:3001/lastPicture'
    body = {'fileName': fileName}
    requests.post(url, json=body)


def main():
    print("start")
    fileName = generateFileName('America/Los_Angeles')
    takePicture(fileName)
    pushPicture(fileName)
    print("done")


if __name__ == "__main__":
    main()
