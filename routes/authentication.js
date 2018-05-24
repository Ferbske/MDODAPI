const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const db = require('../db/databaseConnector');
const Errors = require('../models/Errors');
const Psychologist = require('../models/Psych');
const Client = require('../models/Client');
const bcrypt = require('bcrypt');

router.post("/login/:role", (req, res) => {
    let role = req.params.role;
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
                    "token": token,
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

            if (rows.length < 1) {
                let error = Errors.notFound()
                res.status(error.code).json(error)
                return;
            }

            if (email == rows[0].email && password == rows[0].password) {
                var token = auth.encodeToken(email);
                res.status(200).json({
                    "token": token,
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

router.post("/register/:role", (req, res) => {
    // Define the properties for a user. (Super class).
    const email = req.body.email || "";
    const password = req.body.password ||"";
    const firstname = req.body.firstname || "";
    const infix = req.body.infix || "";
    const lastname = req.body.lastname || "";
    const phonenumber = req.body.phonenumber || "";
    const saltRounds = 10;

    if (req.params.role === "psychologist") {
        // Define the properties for a psychologist (Sub class).
        const location = req.body.location || "";

        const psychologist = new Psychologist(email, password, firstname, infix, lastname, location, phonenumber);

        if (psychologist._email) {
            const name = infix ? `${firstname} ${infix} ${lastname}` : `${firstname} ${lastname}`;

            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    db.query("SELECT email FROM mdod.Psychologist WHERE email = ?", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        if (rows.length > 0) {
                            const error = Errors.conflict();
                            res.status(error.code).json(error);
                            return;
                        }

                        db.query("INSERT INTO mdod.Psychologist VALUES(?, ?, ?, ?, ?)", [name, email, hash, phonenumber, location], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error)
                            }

                            res.status(201).json({
                                message: "Psycholoog aangemaakt"
                            })
                        })
                    });
                })
            });
        } else {
            res.status(psychologist.code).json(psychologist);
        }

    } else if (req.params.role === "client") {
        // Define the properties for a client (Sub class).
        const dob = req.body.dob || "";
        const city = req.body.city || "";
        const address = req.body.adress || "";
        const zipCode = req.body.zipcode || "";

        const client = new Client(email, password, firstname, infix, lastname, phonenumber, dob, city, address, zipCode);

        if(client._email) {
            const name = infix ? `${firstname} ${infix} ${lastname}` : `${firstname} ${lastname}`;

            bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }

                        if (rows.length > 0) {
                            const error = Errors.conflict();
                            res.status(error.code).json(error);
                            return;
                        }

                        db.query("INSERT INTO mdod.Client VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)", [email, null, name, hash, phonenumber, dob, city, address, zipCode], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(error)
                            }

                            res.status(201).json({
                                message: "Client aangemaakt"
                            })
                        })
                    });
                });
            });
        } else {
            res.status(client.code).json(client);
        }
    }

});

module.exports = router;
