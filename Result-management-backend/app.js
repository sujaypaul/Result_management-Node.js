const {User} = require('./models/index')

const express = require('express')
const app = express()
const cors = require("cors");
var corsOptions = {
  origin: "http://localhost:4000"
};

app.use(cors(corsOptions));const dotenv = require("dotenv");
dotenv.config();

const bodyparser = require("body-parser");
const TeacherRouter = require('./controller/teacherController.js');
const StudentRouter = require('./controller/studentController');

const port = process.env.PORT
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}))

app.use('/teacher',TeacherRouter);
app.use('/student',StudentRouter);


app.listen(port, async() => {
    console.log(`Listening to the server on http://localhost:${port}`);
})