const express = require('express');
const router = express.Router({});
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const Substance = require('../models/Substance');

router.route('/')
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            const email = payload.sub;

            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                const name = req.body.name || '';
                const measuringUnit = req.body.measuringUnit || '';

                const Substance = new Substance(name, measuringUnit);

                if (Substance._name) {
                    db.query("INSERT INTO mdod.Substance(name, measuringUnit) VALUES(?, ?);", [Substance._name, Substance._measuringUnit], (error, result) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        }

                        if (result.affectedRows < 1) {
                            const error = Errors.forbidden();
                            res.status(error.code).json(error);
                            return;
                        }

                        res.status(201).json({
                            message: "Middel aangemaakt"
                        })
                    })
                } else {
                    res.status(Substance.code).json(Substance);
                }
            })
        })
    });

router.route('/all')
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            }

            db.query("SELECT * FROM mdod.Substance", (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                }

                if (rows.length < 1) {
                    const error = Errors.notFound();
                    res.status(error.code).json(error);
                }

                res.status(200).json(rows);
            })
        })
    });

module.exports = router;