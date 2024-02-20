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
    let query = "SELECT start_hour, duration FROM shackSchedule ORDER BY start_hour";
    db.query(query, function (err, result) {
        if (err)
            throw console.error(err);
        res.send(result);
    });
});
router.post("/update", function (req, res) {
    let query = `UPDATE shackSchedule SET startHour=${req.body.startHour}, duration=${req.body.duration} WHERE id=${req.body.id}`;
    console.log(query);
    db.query(query, function (err, result) {
        if (err)
            throw console.error(err);
        res.send(result);
    });
});
module.exports = router;
