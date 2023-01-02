const express = require('express');
const path = require('path');
const bodyparser = require("body-parser");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const dotenv = require("dotenv");

const teacherRouter = require("./routes/teacherRouter");
const studentRouter = require("./routes/studentRouter");

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }))
dotenv.config();
const port = process.env.PORT;

//view engine
app.set('view engine', 'ejs');

//load static assets
app.use('/static',express.static(path.join(__dirname,'public')));
app.use('/assets',express.static(path.join(__dirname,'public/assets')));

// middlewares
app.use(session({
    secret:uuidv4(),
    resave:false,
    saveUninitialized:false
}))

//Routes
app.use('/teacher',teacherRouter);
app.use('/student',studentRouter);

//HOME ROUTE
app.get('/', (req, res) => {
    if(req.session.role=="teacher"){
        res.redirect('/teacher/dashboard');
    }else if(req.session.role=="student"){
        res.redirect('/student/dashboard');
    }else{
        res.render('base', { title: "Login" });
    }
})
app.get('/loginAgain',(req,res)=>{
    res.render('base', { title: "Login" });
})

// route for logout
app.get('/logout', (req ,res)=>{
    req.session.destroy(function(err){
        if(err){
            console.log(err);
            res.send("Error")
        }else{
            res.redirect("/")
        }
    })
})

app.listen(port, () => { console.log("Listening to the server on http://localhost:"+port) })