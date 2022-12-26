from flask import Flask
from cam import Cam
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)
cam = Cam()

cors = CORS(app, resource={
    r"*":{
         "origins":["shackpi.local","Ryans-MacBook-Pro.local"],
    }
})

app.config.update(
    DEBUG=os.environ.get("FLASK_DEBUG"),
    ENV=os.environ.get("FLASK_ENV")
)

@app.route('/takePicture')
def takePicture():
    return cam.main()
