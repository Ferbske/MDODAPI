const express = require('express');
const router = express.Router({});
const global = require('../globalFunctions');
const auth = require('../auth/authentication');
const db = require('../db/databaseConnector');
const Errors = require('../models/Errors');

router.route('/single_client')
/**
 * Get all the addictions for a single client.
 */
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get psychologist email;
            const psychologistEmail = payload.sub;

            // Get the client email.
            const clientEmail = req.body.email || '';

            global.checkIfEmailIsPsychologistEmail(psychologistEmail, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    global.checkIfEmailIsClientEmail(clientEmail, (error, clientRows) => {
                        if (error) {
                            res.status(error.code).json(error);
                            return;
                        } else {
                            db.query("SELECT mdod.Addiction.id, mdod.Addiction.substanceId, mdod.Addiction.email, mdod.Substance.name, mdod.Substance.measuringUnit\n" +
                                "FROM mdod.Addiction \n" +
                                "\tINNER JOIN mdod.Substance ON mdod.Addiction.substanceId = mdod.Substance.id\n" +
                                "\tWHERE mdod.Addiction.email = ?;", [clientEmail], (error, rows, fields) => {
                                if (error) {
                                    console.log(error);
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
                                    return;
                                } else if (rows.length < 1) {
                                    const error = Errors.notFound();
                                    res.status(error.code).json(error);
                                    return;
                                } else {
                                    res.status(200).json(rows);
                                }
                            });
                        }
                    })
                }
            });
        });
    });

router.route('/:addictionId?')
/**
 * Create a single addiction for a single client. Client email will be set in the body.
 */
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get psychologist email;
            const psychologistEmail = payload.sub;

            // Get the client email.
            const clientEmail = req.body.email || '';

            global.checkIfEmailIsPsychologistEmail(psychologistEmail, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    global.checkIfEmailIsClientEmail(clientEmail, (error, clientRows) => {
                        if (error) {
                            res.status(error.code).json(error);
                            return;
                        } else {
                            const substanceId = req.body.substanceId || '';

                            db.query("SELECT mdod.Addiction.substanceId, mdod.Addiction.email FROM mdod.Addiction " +
                                "WHERE mdod.Addiction.substanceId = ? AND mdod.Addiction.email = ?", [substanceId, clientEmail], (error, rows) => {
                                if (rows.length <= 0) {
                                    db.query("INSERT INTO mdod.Addiction(substanceId, email) VALUES(?, ?);", [substanceId, clientEmail], (error, result) => {
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
                                            message: "Verslaving aangemaakt"
                                        })
                                    })
                                } else {
                                    res.status(400).json({
                                        "message": "Bad request"
                                    })
                                }
                            });
                        }
                    })
                }
            });
        });
    })
    /**
     * Update a single addiction for a single client.
     */
    .put((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get psychologist email;
            const psychologistEmail = payload.sub;

            // Get the client email.
            const clientEmail = req.body.email || '';

            global.checkIfEmailIsPsychologistEmail(psychologistEmail, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    global.checkIfEmailIsClientEmail(clientEmail, (error, clientRows) => {
                        if (error) {
                            res.status(error.code).json(error);
                            return;
                        } else {
                            const addictionId = req.params.addictionId || '';
                            const substanceId = req.body.substanceId || '';
                            db.query("UPDATE mdod.Addiction SET substanceId = ?, email = ? WHERE id = ?", [substanceId, clientEmail, addictionId], (error, result) => {
                                if (error) {
                                    console.log(error);
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
                                }
                                else if (result.affectedRows < 1) {
                                    const error = Errors.forbidden();
                                    res.status(error.code).json(error);
                                } else {
                                    res.status(202).json({
                                        message: "Verslaving geupdate"
                                    })
                                }
                            })
                        }
                    })
                }
            });
        })
    })
    .delete((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get psychologist email;
            const psychologistEmail = payload.sub;

            // Get the client email.
            const clientEmail = req.body.email || '';

            global.checkIfEmailIsPsychologistEmail(psychologistEmail, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    global.checkIfEmailIsClientEmail(clientEmail, (error, clientRows) => {
                        if (error) {
                            res.status(error.code).json(error);
                            return;
                        } else {
                            const addictionId = req.params.addictionId || '';
                            db.query("DELETE FROM mdod.Addiction WHERE id = ?", [addictionId], (error, result) => {
                                if (error) {
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
                                    return;
                                }

                                if (result.affectedRows < 1) {
                                    const err = Errors.forbidden();
                                    res.status(err.code).json(err);
                                    return;
                                }

                                res.status(200).json({
                                    message: "Addiction deleted."
                                });
                            });
                        }
                    });
                }
            });
        });
    });
module.exports = router;