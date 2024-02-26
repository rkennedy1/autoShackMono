"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
let router = express_1.default.Router();
var db = require("./db");
router.use(express_1.default.json());
router.use(express_1.default.urlencoded({ extended: true }));
router.get("/", function (req, res) {
    let query = "SELECT start_hour, duration, id FROM shackSchedule ORDER BY start_hour";
    db.query(query, function (err, result) {
        if (err)
            throw console.error(err);
        res.send(result);
    });
});
router.post("/update", function (req, res) {
    let query = `UPDATE shackSchedule SET start_hour=${req.body.start_hour}, duration=${req.body.duration} WHERE id=${req.body.id}`;
    db.query(query, function (err, result) {
        if (err)
            throw console.error(err);
        let query = `SELECT start_hour, duration, id FROM shackSchedule WHERE id = ${req.body.id}`;
        db.query(query, function (err, result) {
            if (err)
                throw console.error(err);
            res.send(result);
        });
    });
});
router.post("/add", function (req, res) {
    let query = `INSERT INTO shackSchedule (start_hour, duration) VALUES (${req.body.start_hour},${req.body.duration})`;
    db.query(query, function (err, resp) {
        if (err)
            throw console.error(err);
        let query = `SELECT start_hour, duration, id FROM shackSchedule WHERE id = ${resp.insertId}`;
        db.query(query, function (err, result) {
            if (err)
                throw console.error(err);
            res.send(result);
        });
    });
});
router.post("/delete", function (req, res) {
    let query = `DELETE FROM shackSchedule WHERE id = ${req.body.id}`;
    db.query(query, function (err, resp) {
        if (err)
            throw console.error(err);
        res.send(resp);
    });
});
module.exports = router;
