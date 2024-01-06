export {};
import express, { Request, Response } from "express";
let router = express.Router();

var db = require("./db");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

interface shackSchedule {
  poo: null;
}

router.get("/", function (req: Request, res: Response) {
  let query = "SELECT * FROM shackSchedule";
  db.query(query, function (err: Error, result: shackSchedule) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.post("/update", function (req: Request, res: Response) {
  let query = `UPDATE shackSchedule SET startHour=${req.body.startHour}, duration=${req.body.duration} WHERE id=${req.body.id}`;
  console.log(query);
  db.query(query, function (err: Error, result: shackSchedule) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

module.exports = router;
