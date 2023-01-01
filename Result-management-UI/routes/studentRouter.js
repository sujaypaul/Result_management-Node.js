var express = require("express");
var router = express.Router();
var fetch = require('node-fetch')

//login
router.post('/login', (req, res) => {

    fetch('http://localhost:3000/student/login', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
        .then(json => checkStatus(json, res))
        .catch(err => console.log(err));

    function checkStatus(resp, res) {
        if (resp.Token) {
            req.session.token = resp.Token;
            req.session.role = "student";
            res.redirect('/student/dashboard');
        } else {
            res.render('base', { errorStudent: resp.error, title: "Login" });
        }
    }
})

// route for dashboard
router.get('/dashboard', (req, res) => {

    if (!req.session.token) {
        res.redirect("/")
    }
    else if (req.session.role !== "student") {
        res.redirect('/teacher/dashboard');
    }
    else {
        res.render('dashboardStudent', { title: "Student Dashboard" })
    }
})

//searchResult
router.post('/searchResult', async (req, res) => {
    if (!req.session.token) {
        res.redirect("/")
    }
    else if (req.session.role !== "student") {
        res.redirect('/teacher/dashboard');
    }
    else {

        const response = await fetch("http://localhost:3000/student/findResult", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.session.token
            },
            body: JSON.stringify(req.body)
        });

        response.json().then(data => {
            var msg = data
                ? " : Result found for Roll no. " + req.body.RollNo + " with DOB " + req.body.DOB
                : "No result found";
            console.log(response.status + " : " + msg);
            res.render('dashboardStudent', { title: "Student Result", result: data, called: true })
        });

    }

})


module.exports = router;
