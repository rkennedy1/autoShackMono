import express, { Request, Response } from "express";
let router = express.Router();

var db = require("./db");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

interface shackSchedule {
  poo: null;
}

interface sqlUpdateResponse {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
}

router.get("/", function (req: Request, res: Response) {
  let query =
    "SELECT start_hour, duration, id FROM shackSchedule ORDER BY start_hour";
  db.query(query, function (err: Error, result: shackSchedule) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.post("/update", function (req: Request, res: Response) {
  let query = `UPDATE shackSchedule SET start_hour=${req.body.start_hour}, duration=${req.body.duration} WHERE id=${req.body.id}`;
  db.query(query, function (err: Error, result: sqlUpdateResponse) {
    if (err) throw console.error(err);
    let query = `SELECT start_hour, duration, id FROM shackSchedule WHERE id = ${req.body.id}`;
    db.query(query, function (err: Error, result: shackSchedule) {
      if (err) throw console.error(err);
      res.send(result);
    });
  });
});

router.post("/add", function (req: Request, res: Response) {
  let query = `INSERT INTO shackSchedule (start_hour, duration) VALUES (${req.body.start_hour},${req.body.duration})`;
  db.query(query, function (err: Error, resp: sqlUpdateResponse) {
    if (err) throw console.error(err);
    let query = `SELECT start_hour, duration, id FROM shackSchedule WHERE id = ${resp.insertId}`;
    db.query(query, function (err: Error, result: shackSchedule) {
      if (err) throw console.error(err);
      res.send(result);
    });
  });
});

router.post("/delete", function (req: Request, res: Response) {
  let query = `DELETE FROM shackSchedule WHERE id = ${req.body.id}`;
  db.query(query, function (err: Error, resp: sqlUpdateResponse) {
    if (err) throw console.error(err);
    res.send(resp);
  });
});
module.exports = router;
