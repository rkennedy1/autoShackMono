import express, { Request, Response } from "express";
const router = express.Router();
const db = require("./db");

interface shackLog {
  poo: number;
}

function buildLastNDaysQuery(n: number) {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");
}

router.get("/lastDay", function (req: Request, res: Response) {
  const yesterdayStr = buildLastNDaysQuery(1);
  const query = `SELECT * FROM shacklog WHERE datetime>="` + yesterdayStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/lastThreeDays", function (req: Request, res: Response) {
  const lastThreeDaysStr = buildLastNDaysQuery(3);
  const query =
    `SELECT * FROM shacklog WHERE datetime>="` + lastThreeDaysStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});
``;

router.get("/lastWeek", function (req: Request, res: Response) {
  const lastWeekStr = buildLastNDaysQuery(7);
  const query = `SELECT * FROM shacklog WHERE datetime>="` + lastWeekStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastTwoWeeks", function (req: Request, res: Response) {
  const lastTwoWeekStr = buildLastNDaysQuery(14);
  const query = `SELECT * FROM shacklog WHERE datetime>="` + lastTwoWeekStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastMonth", function (req: Request, res: Response) {
  const lastMonthStr = buildLastNDaysQuery(30);
  const query = `SELECT * FROM shacklog WHERE datetime>="` + lastMonthStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastItem", function (req: Request, res: Response) {
  const query = `SELECT * FROM shacklog ORDER BY id DESC LIMIT 1;`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastFlow", function (req: Request, res: Response) {
  const query = `SELECT * FROM shacklog WHERE flow_rate>=1 ORDER BY id DESC LIMIT 1;`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastTenFlows", function (req: Request, res: Response) {
  const query = `SELECT * FROM shacklog WHERE flow_rate>=1 ORDER BY id DESC LIMIT 10;`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

module.exports = router;
