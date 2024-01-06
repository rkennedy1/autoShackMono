"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const bodyParse = require("body-parser");
const app = (0, express_1.default)();
app.use(cors());
app.use(bodyParse.urlencoded({ extended: false }));
app.use(bodyParse.json());
let lastPicture = "";
app.listen(process.env.PORT, () => console.log("API is running on port ", process.env.PORT));
app.use(express_1.default.static("public"));
app.use("/images", express_1.default.static("images"));
app.post("/lastPicture", function (req, res) {
    lastPicture = req.body.fileName;
    res.send("a ok");
});
app.get("/lastPicture", function (req, res) {
    res.json({ lastPic: lastPicture });
});
var dataRouter = require("./src/data.js");
app.use("/data", dataRouter);
var scheduleRouter = require("./src/schedule.js");
app.use("/schedule", scheduleRouter);
