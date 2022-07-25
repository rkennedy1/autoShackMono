require('dotenv').config();
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

app.listen(process.env.PORT, () => console.log('API is running on port ', process.env.PORT))

var dataRouter = require('./data.js')
app.use('/data', dataRouter)

var scheduleRouter = require('./schedule.js')
app.use('/schedule', scheduleRouter)
