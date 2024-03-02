import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dataRouter from "./src/data.js";
import scheduleRouter from "./src/schedule.js";
import RateLimit from "express-rate-limit";

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

dotenv.config();

const app = express();
const PORT = process.env.PORT || 1783;

app.use(limiter);
app.use(cors());
app.use(express.json());

let lastPicture = "";

app.listen(PORT, () => console.log(`API is running on port ${PORT}`));

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.post("/lastPicture", (req: Request, res: Response) => {
  lastPicture = req.body.fileName;
  res.send("OK");
});

app.get("/lastPicture", (req: Request, res: Response) => {
  res.json({ lastPic: lastPicture });
});

app.use("/data", dataRouter);
app.use("/schedule", scheduleRouter);
