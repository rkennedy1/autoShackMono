from flask import Flask
from cam import Cam
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app, origins=["http://shackpi.local",
     "http://Ryans-MacBook-Pro.local", "http://guestserver.local"])
cam = Cam()

app.config.update(
    DEBUG=os.environ.get("FLASK_DEBUG"),
    ENV=os.environ.get("FLASK_ENV")
)


@app.route('/takePicture')
def takePicture():
    return cam.main()
