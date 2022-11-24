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

router.post("/update", function (req, res) {
  let query = `UPDATE shackSchedule SET startHour=${req.body.startHour}, duration=${req.body.duration} WHERE id=${req.body.id}`;
  console.log(query);
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err);
    res.send(result);
  });
});

module.exports = router;
