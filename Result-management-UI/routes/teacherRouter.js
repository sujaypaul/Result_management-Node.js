var express = require("express");
var router = express.Router();
var fetch = require('node-fetch')

//login
router.post('/login', (req, res) => {

    fetch('http://localhost:3000/teacher/login', {
        method: 'POST',
        body: JSON.stringify(req.body),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
        .then(json => checkStatus(json, res))
        .catch(err => console.log(err));

    function checkStatus(resp, res) {
        if (resp.Token) {
            req.session.token = resp.Token;
            req.session.role = "teacher";
            res.redirect('/teacher/dashboard');
        } else {
            res.render('base', { errorTeacher: resp.error, title: "Login" });
        }
    }
})

// route for dashboard
router.get('/dashboard', async (req, res) => {

    if (!req.session.token) {
        res.redirect("/")
    }
    else if (req.session.role !== "teacher") {
        res.redirect('/student/dashboard');
    }
    else {

        const response = await fetch("http://localhost:3000/teacher/resultList", {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.session.token
            }
        });

        response.json().then(data => {
            data.sort((a, b) => {
                return a.RollNo - b.RollNo;
            });
            res.render(
                'dashboardTeacher',
                {
                    title: "Teacher Dashboard",
                    student: data,
                    error: null
                })
        });

    }
})

//addResult
router.post('/addResult', async (req, res) => {

    if (!req.session.token) {
        res.redirect("/")
    }
    else if (req.session.role !== "teacher") {
        res.redirect('/student/dashboard');
    }
    else {

        const response = await fetch("http://localhost:3000/teacher/addResult/", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.session.token
            },
            body: JSON.stringify(req.body)
        });

        response.json().then(data => {
            if (data.error) {
                console.log(response.status + " : cannot add " + data.error);
                const Data = data.results;
                Data.sort((a, b) => {
                    return a.RollNo - b.RollNo;
                });
                res.render(
                    'dashboardTeacher',
                    {
                        title: "Teacher Dashboard",
                        student: Data,
                        error: data.error,
                        status: response.status
                    })
            } else {
                console.log(response.status + " : " + "Result added");
                res.redirect('/teacher/dashboard');
            }
        });

    }
})


//updateResult
router.post('/updateResult', async (req, res) => {

    if (!req.session.token) {
        res.redirect("/")
    }
    else if (req.session.role !== "teacher") {
        res.redirect('/student/dashboard');
    }
    else {

        const rollNo = req.body.RollNo;

        const response = await fetch("http://localhost:3000/teacher/updateResult/" + rollNo, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.session.token
            },
            body: JSON.stringify(req.body)
        });

        response.json().then(data => {
            console.log(response.status + " : " + "Result updated for Roll no - " + rollNo);
            res.redirect('/teacher/dashboard');
        });

    }


})


//deleteResult
router.get('/delete/:rollNo', async (req, res) => {

    if (!req.session.token) {
        res.redirect("/")
    }
    else if (req.session.role !== "teacher") {
        res.redirect('/student/dashboard');
    }
    else {

        const rollNo = req.params.rollNo;

        const response = await fetch("http://localhost:3000/teacher/deleteResult/" + rollNo, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + req.session.token
            }
        });

        response.json().then(data => {
            console.log(response.status + " : " + "Result Deleted for Roll no - " + rollNo);
            res.redirect('/teacher/dashboard');
        });

    }


})

module.exports = router;
