import express, { Request, Response } from "express";
import { shackLogItem } from "../models";
const db = require("./db");
import { MysqlError } from "mysql";
const router = express.Router();

function buildLastNDaysQuery(n: number) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 10); // Corrected to get only the date part
}

router.get("/lastDay", function (req: Request, res: Response) {
  const yesterdayStr = buildLastNDaysQuery(1);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${yesterdayStr}'`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastThreeDays", function (req: Request, res: Response) {
  const lastThreeDaysStr = buildLastNDaysQuery(3);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastThreeDaysStr}'`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastWeek", function (req: Request, res: Response) {
  const lastWeekStr = buildLastNDaysQuery(7);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastWeekStr}'`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastTwoWeeks", function (req: Request, res: Response) {
  const lastTwoWeekStr = buildLastNDaysQuery(14);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastTwoWeekStr}'`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastMonth", function (req: Request, res: Response) {
  const lastMonthStr = buildLastNDaysQuery(30);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastMonthStr}'`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastItem", function (req: Request, res: Response) {
  const query = `SELECT * FROM shacklog ORDER BY id DESC LIMIT 1`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastFlow", function (req: Request, res: Response) {
  const query = `SELECT * FROM shacklog WHERE flow_rate >= 1 ORDER BY id DESC LIMIT 1`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

router.get("/lastTenFlows", function (req: Request, res: Response) {
  const query = `SELECT * FROM shacklog WHERE flow_rate >= 1 ORDER BY id DESC LIMIT 10`;
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
});

export default router;
