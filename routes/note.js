const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Goal = require('../models/Goal');
const global = require('../globalFunctions');

router.route('/')
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            // Get the email from payload.
            const email = payload.sub || '';

            // Check if email from token is a psychologist email.
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.affectedRows < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                const clientEmail = req.body.email || '';

                db.query("SELECT EMAIL FROM mdod.Client WHERE email = ?;", [clientEmail], (error, rows, fiels) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    if (rows.affectedRows < 1) {
                        const error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }

                    const description = req.body.description || '';
                    db.query("INSERT INTO mdod.Note(email, description) VALUES(?, ?);", [clientEmail, description], (error, result) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        }

                        if (rows.affectedRows < 1) {
                            const error = Errors.forbidden();
                            res.status(error.code).json(error);
                            return;
                        }

                        res.status(201).json({
                            message: "Notitie aangemaakt."
                        })
                    })
                });
            })
        })
    });

module.exports = router;