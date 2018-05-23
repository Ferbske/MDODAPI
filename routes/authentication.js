const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const db = require('../db/databaseConnector');
const isEmail = require('isemail');
const Errors = require('../models/Errors');

router.post("/login/:role", (req, res) => {
    let role = req.params.role
    let email = req.body.email || '';
    let password = req.body.password || '';

    if (role === 'psychologist') {
        db.query("SELECT email, password FROM mdod.Psychologist WHERE email = ?", [email], function (err, rows, fields) {
            if (err) {
                res.status(500).json(err)
                return;
            }
            console.log(rows[0]);

            if (rows.length < 1) {
                let error = Errors.notFound()
                res.status(error.code).json(error)
                return;
            }

            if (email == rows[0].email && password == rows[0].password) {
                var token = auth.encodeToken(email);
                res.status(200).json({
                    "token": 'Bearer ' + token,
                    "status": 200,
                    "parameters": res.body
                });
            } else {
                let error = Errors.unauthorized()
                res.status(error.code).json(error)
                return;
            }
        })
    }else if(role == 'client'){
        db.query("SELECT email, password FROM mdod.Client WHERE email = ?", [email], function (err, rows, fields) {
            if (err) {
                res.status(500).json(err)
                return;
            }
            console.log(rows[0]);

            if (rows.length < 1) {
                let error = Errors.notFound()
                res.status(error.code).json(error)
                return;
            }

            if (email == rows[0].email && password == rows[0].password) {
                var token = auth.encodeToken(email);
                res.status(200).json({
                    "token": 'Bearer ' + token,
                    "status": 200,
                    "parameters": res.body
                });
            } else {
                let error = Errors.unauthorized()
                res.status(error.code).json(error)
                return;
            }
        })
    }
});

router.post("/register", (req, res) => {

});

module.exports = router;