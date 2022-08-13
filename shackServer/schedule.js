let express = require("express");

let router = express.Router();
var db = require("./db");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/", function (req, res) {
  let query = "SELECT * FROM shackSchedule";
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

router.post("/", function (req, res) {
  let query = `INSERT INTO shackSchedule (startHour, startMinute, duration)
    VALUES(${req.body.startHour}, ${req.body.startMinute}, ${req.body.duration})
    ON DUPLICATE KEY UPDATE startHour=${req.body.startHour},
    startMinute=${req.body.startMinute}, duration=${req.body.duration}`;
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

module.exports = router;
