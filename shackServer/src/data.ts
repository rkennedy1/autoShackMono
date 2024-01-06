export {};
import express, { Request, Response } from "express";
let router = express.Router();
const bodyParser = require("body-parser");
var db = require("./db");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

interface shackLog {
  poo: number;
}

function buildLastNDaysQuery(n: number) {
  var date = new Date();
  date.setDate(date.getDate() - n);
  return date.toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ");
}

router.get("/lastDay", function (req: Request, res: Response) {
  let yesterdayStr = buildLastNDaysQuery(1);
  let query = `SELECT * FROM shacklog WHERE datetime>="` + yesterdayStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw err;
    res.send(result);
  });
});

router.get("/lastThreeDays", function (req: Request, res: Response) {
  let lastThreeDaysStr = buildLastNDaysQuery(3);
  let query =
    `SELECT * FROM shacklog WHERE datetime>="` + lastThreeDaysStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});
``;

router.get("/lastWeek", function (req: Request, res: Response) {
  let lastWeekStr = buildLastNDaysQuery(7);
  let query = `SELECT * FROM shacklog WHERE datetime>="` + lastWeekStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastTwoWeeks", function (req: Request, res: Response) {
  let lastTwoWeekStr = buildLastNDaysQuery(14);
  let query = `SELECT * FROM shacklog WHERE datetime>="` + lastTwoWeekStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastMonth", function (req: Request, res: Response) {
  let lastMonthStr = buildLastNDaysQuery(30);
  let query = `SELECT * FROM shacklog WHERE datetime>="` + lastMonthStr + `"`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastItem", function (req: Request, res: Response) {
  let query = `SELECT * FROM shacklog ORDER BY id DESC LIMIT 1;`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.get("/lastFlow", function (req: Request, res: Response) {
  let query = `SELECT * FROM shacklog WHERE flow_rate>=1 ORDER BY id DESC LIMIT 1;`;
  db.query(query, function (err: Error, result: shackLog[]) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

module.exports = router;
