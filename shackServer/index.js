require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
let lastPicture = ""

app.listen(process.env.PORT, () =>
  console.log("API is running on port ", process.env.PORT)
);

app.use(express.static('public')); 
app.use('/images', express.static('images'));

app.post('/lastPicture', function (req, res) {
    lastPicture = req.body.fileName
})
app.get('/lastPicture', function (req, res) {
    res.send(lastPicture)
})

var dataRouter = require("./data.js");
app.use("/data", dataRouter);

var scheduleRouter = require("./schedule.js");
app.use("/schedule", scheduleRouter);
