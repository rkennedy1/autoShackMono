let express = require('express')
let router = express.Router()
let bodyParser = require('body-parser');
var db = require('./db');

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

function buildLastNDaysQuery(n) {
  var date = new Date();
  date.setDate(date.getDate()-n)
  return date.toISOString().slice(0, 19).replace(/-/g, "-").replace("T", " ")
}

router.get('/lastDay', function (req,res) {
  let yesterdayStr = buildLastNDaysQuery(1)
  let query = `SELECT * FROM shacklog WHERE datetime>="`+yesterdayStr+`"`
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err)
    res.send(result)
  })
})

router.get('/lastThreeDays', function (req,res) {
  let lastThreeDaysStr = buildLastNDaysQuery(3)
  let query = `SELECT * FROM shacklog WHERE datetime>="`+lastThreeDaysStr+`"`
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err)
    res.send(result)
  })
})

router.get('/lastWeek', function (req,res) {
  let lastWeekStr = buildLastNDaysQuery(7)
  let query = `SELECT * FROM shacklog WHERE datetime>="`+lastWeekStr+`"`
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err)
    res.send(result)
  })
})

router.get('/lastTwoWeeks', function (req,res) {
  let lastTwoWeekStr = buildLastNDaysQuery(14)
  let query = `SELECT * FROM shacklog WHERE datetime>="`+lastTwoWeekStr+`"`
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err)
    res.send(result)
  })
})

router.get('/lastMonth', function (req,res) {
  let lastMonthStr = buildLastNDaysQuery(30)
  let query = `SELECT * FROM shacklog WHERE datetime>="`+lastMonthStr+`"`
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err)
    res.send(result)
  })
})

router.get('/lastItem', function (req,res) {
  let query = `SELECT * FROM shacklog ORDER BY id DESC LIMIT 1;`
  db.query(query, function (err, result, fields) {
    if (err) throw console.error(err)
    res.send(result)
  })
})

module.exports = router;
