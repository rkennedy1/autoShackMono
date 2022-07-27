require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let lastPicture = ""

app.listen(process.env.PORT, () =>
  console.log("API is running on port ", process.env.PORT)
);

app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.post('/lastPicture', function (req, res) {
    console.log(req.body)
    lastPicture = req.body.fileName
})
app.get('/lastPicture', function (req, res) {
    res.send(lastPicture)
})

var dataRouter = require("./data.js");
app.use("/data", dataRouter);

var scheduleRouter = require("./schedule.js");
app.use("/schedule", scheduleRouter);
