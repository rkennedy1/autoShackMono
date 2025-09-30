import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import dataRouter from "./src/data";
import scheduleRouter from "./src/schedule";
import RateLimit from "express-rate-limit";

const limiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per windowMs
});

dotenv.config();

const app = express();
export const PORT = process.env.PORT || 1783;

app.use(limiter);
app.use(cors());
app.use(express.json());

let lastPicture = "";

app.listen(PORT, () => console.log(`API is running on port ${PORT}`));

app.use(express.static("public"));
app.use("/images", express.static("images"));

app.post("/lastPicture", (req: Request, res: Response) => {
  // #swagger.tags = ['Camera']
  lastPicture = req.body.fileName;
  res.send("OK");
});

app.get("/lastPicture", (req: Request, res: Response) => {
  // #swagger.tags = ['Camera']
  res.json({ lastPic: lastPicture });
});

app.use("/data", dataRouter);
app.use("/schedule", scheduleRouter);

// Error handling middleware
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack, req.originalUrl);
  res.status(500).send("Something went wrong!");
});
