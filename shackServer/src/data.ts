import express, { Request, Response, NextFunction } from "express";
import { shackLogItem } from "../models";
const db = require("./db");
import { MysqlError } from "mysql";
const router = express.Router();

// Reusable function for executing database queries
function executeQuery(query: string, res: Response) {
  db.query(query, function (err: MysqlError | null, result: shackLogItem[]) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send(result);
  });
}

// Function to build query for last N days
function buildLastNDaysQuery(n: number) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 10);
}

router.get("/lastDay", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const yesterdayStr = buildLastNDaysQuery(1);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${yesterdayStr}'`;
  executeQuery(query, res);
});

router.get("/lastThreeDays", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const lastThreeDaysStr = buildLastNDaysQuery(3);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastThreeDaysStr}'`;
  executeQuery(query, res);
});

router.get("/lastDay", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const yesterdayStr = buildLastNDaysQuery(1);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${yesterdayStr}'`;
  executeQuery(query, res);
});

router.get("/lastThreeDays", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const lastThreeDaysStr = buildLastNDaysQuery(3);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastThreeDaysStr}'`;
  executeQuery(query, res);
});

router.get("/lastWeek", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const lastWeekStr = buildLastNDaysQuery(7);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastWeekStr}'`;
  executeQuery(query, res);
});

router.get("/lastTwoWeeks", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const lastTwoWeekStr = buildLastNDaysQuery(14);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastTwoWeekStr}'`;
  executeQuery(query, res);
});

router.get("/lastMonth", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const lastMonthStr = buildLastNDaysQuery(30);
  const query = `SELECT * FROM shacklog WHERE DATE(datetime) >= '${lastMonthStr}'`;
  executeQuery(query, res);
});

router.get("/lastItem", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const query = `SELECT * FROM shacklog ORDER BY id DESC LIMIT 1`;
  executeQuery(query, res);
});

router.get("/lastFlow", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const query = `SELECT * FROM shacklog WHERE flow_rate >= 1 ORDER BY id DESC LIMIT 1`;
  executeQuery(query, res);
});

router.get("/lastTenFlows", function (req: Request, res: Response) {
  // #swagger.tags = ['Shack Log']
  const query = `SELECT * FROM shacklog WHERE flow_rate >= 1 ORDER BY id DESC LIMIT 10`;
  executeQuery(query, res);
});

export default router;
