var express = require("express");
var router = express.Router();

var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const { User } = require('../models/index');
const ResultService = require('../service/resultsService');
const resultService = new ResultService();
const UserService = require('../service/userService');
const userService = new UserService();


//_____________________STUDENT REGISTER_____________________
router.post('/register', async (req, res) => {
    var user = {
        email: req.body.email,
        password: req.body.password,
        role: "student"
    };
    try {
        if (await userService.find(user.email)) {
            throw { error: "user already exists" };
        };
        const created_user = await userService.create(user);
        return res.status(201).json(created_user)
    } catch (error) {
        return res.status(400).json(error );
    }
})


//_____________________STUDENT LOGIN_____________________
router.post('/login', async (req, res) => {
    const user = await userService.find(req.body.email);
    if (user) {
        if (user.role == 'student'){
            token = await userService.login(req.body);
            if(token){
                res.status(200).json(token);
            }else{
                res.status(401).json({ error: "Password Incorrect" });
            }
        }else {
            res.status(406).json({ error: "Teacher not allowed" });
        }
    } else {
        res.status(404).json({ error: "User does not exist" });
    }
})

//__________________FIND RESULT___________________
router.post('/findResult', userService.authenticateJWT("student") , async (req, res) => {

    const result = await resultService.findRollDOB(req.body.RollNo, req.body.DOB)

    if (result) {
        return res.status(200).json( result );
    } else {
        return res.status(404).json(result );
    }

})

module.exports = router;