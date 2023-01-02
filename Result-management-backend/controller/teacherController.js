var express = require("express");
var router = express.Router();

// const { User, Results } = require('../models/index');
const ResultService = require('../service/resultsService');
const UserService = require('../service/userService');

const resultService = new ResultService();
const userService = new UserService();

//____________________TEACHER REGISTER____________________
router.post('/register', async (req, res) => {
    var user = {
        email: req.body.email,
        password: req.body.password,
        role: "teacher"
    };
    try {
        if (await userService.find(user.email)) {
            throw { error: "user already exists" };
        };
        const created_user = await userService.create(user);
        return res.status(201).json(created_user);
    } catch (error) {
        return res.status(400).json(error);
    }
})

//____________________TEACHER LOGIN____________________
router.post('/login', async (req, res) => {
    const user = await userService.find(req.body.email);
    if (user) {
        if (user.role == 'teacher') {
            token = await userService.login(req.body);
            if (token) {
                res.status(200).json(token);
            } else {
                res.status(401).json({ error: "Password Incorrect" });
            }
        } else {
            res.status(406).json({ error: "Student not allowed" });
        }
    } else {
        res.status(404).json({ error: "User does not exist" });
    }
})

//____________________RESULT ADD____________________
router.post('/addResult', userService.authenticateJWT("teacher"), async (req, res) => {
    try {
        const dupResult = await resultService.findRoll(req.body.RollNo);
        const results = await resultService.getAll();
        if (dupResult) {
            return res.status(409).json({ error: "duplicate data found",results:results });
        } else {
            const result = await resultService.create(req.body);
            return res.status(201).json({result,results});
        }

    } catch (error) {
        return res.status(500).json({ error: error.message, req: req.body.RollNo })
    }
});


//____________________RESULT UPDATE____________________
router.put('/updateResult/:RollNo', userService.authenticateJWT("teacher"), async (req, res) => {
    try {
        const { RollNo } = req.params;
        const updated = await resultService.update(RollNo, req.body);
        if (updated) {
            const updatedResult = await resultService.findRoll(req.body.RollNo);
            return res.status(200).json({ Result: updatedResult });
        }
        throw new Error('Result not found');
    } catch (error) {
        return res.status(500).send(error.message);
    }
});

//____________________RESULT DELETE_______________________
router.delete('/deleteResult/:RollNo', userService.authenticateJWT("teacher"), async (req, res) => {
    try {
        const { RollNo } = req.params;
        const deleted = await resultService.delete(RollNo);
        if (deleted) {
            return res.status(200).json({ status: "result deleted" });
        }
        throw new Error("Result not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
});


//________________GET RESULTS LIST_________________
router.get('/resultList', userService.authenticateJWT("teacher"), async (req, res) => {
    const results = await resultService.getAll();
    res.json({results:results});
})


module.exports = router;