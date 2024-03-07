import express, { Request, Response } from "express";
import { SQLUpdateResponse, ShackSchedule } from "../models";
var db = require("./db");
import { MysqlError } from "mysql";
const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", function (req: Request, res: Response) {
  // #swagger.tags = ['Schedule']
  const query =
    "SELECT start_hour, duration, id FROM shackSchedule ORDER BY start_hour";
  db.query(query, function (err: MysqlError | null, result: ShackSchedule[]) {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(result);
  });
});

router.post("/update", function (req: Request, res: Response) {
  // #swagger.tags = ['Schedule']
  const { start_hour, duration, id } = req.body;
  const query = `UPDATE shackSchedule SET start_hour=?, duration=? WHERE id=?`;
  db.query(
    query,
    [start_hour, duration, id],
    function (err: MysqlError | null) {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      const selectQuery = `SELECT start_hour, duration, id FROM shackSchedule WHERE id = ?`;
      db.query(
        selectQuery,
        id,
        function (err: MysqlError | null, result: ShackSchedule[]) {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          res.send(result);
        }
      );
    }
  );
});

router.post("/add", function (req: Request, res: Response) {
  // #swagger.tags = ['Schedule']
  const { start_hour, duration } = req.body;
  const query = `INSERT INTO shackSchedule (start_hour, duration) VALUES (?, ?)`;
  db.query(
    query,
    [start_hour, duration],
    function (err: MysqlError | null, resp: SQLUpdateResponse) {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      const selectQuery = `SELECT start_hour, duration, id FROM shackSchedule WHERE id = ?`;
      db.query(
        selectQuery,
        resp.insertId,
        function (err: MysqlError | null, result: ShackSchedule[]) {
          if (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
            return;
          }
          res.send(result);
        }
      );
    }
  );
});

router.post("/delete", function (req: Request, res: Response) {
  // #swagger.tags = ['Schedule']
  const { id } = req.body;
  const query = `DELETE FROM shackSchedule WHERE id = ?`;
  db.query(
    query,
    id,
    function (err: MysqlError | null, resp: SQLUpdateResponse) {
      if (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.send(resp);
    }
  );
});

export default router;
