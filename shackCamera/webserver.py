from flask import Flask
from cam import Cam

app = Flask(__name__)
cam = Cam()


@app.route('/')
def takePicture():
    cam.main()
    return 'Picture Taken!'
