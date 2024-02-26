require("dotenv").config();
import express, { Request, Response } from "express";
const cors = require("cors");

const app = express();

app.use(cors());

let lastPicture = "";

app.listen(process.env.PORT, () =>
  console.log("API is running on port ", process.env.PORT)
);

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.post("/lastPicture", function (req: Request, res: Response) {
  lastPicture = req.body.fileName;
  res.send("a ok");
});
app.get("/lastPicture", function (req: Request, res: Response) {
  res.json({ lastPic: lastPicture });
});

const dataRouter = require("./src/data.js");
app.use("/data", dataRouter);

const scheduleRouter = require("./src/schedule.js");
app.use("/schedule", scheduleRouter);
