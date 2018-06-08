const express = require('express');
const router = express.Router({});
const usageData = require('./usageData');
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Usage = require('../models/Usage');
const global = require('../globalFunctions');

//Psychologist routes
router.use('/client/data', usageData);

//CRUD Actions
router.route('/:usageId?')
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            const email = payload.sub;

            db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                } else {
                    db.query("SELECT mdod.Usage.id, mdod.Usage.substanceId, " +
                        "mdod.Substance.name, mdod.Substance.measuringUnit, mdod.Usage.usedAt " +
                        "mdod.Usage.location, mdod.Usage.cause, mdod.Usage.amount, mdod.Usage.mood " +
                        "FROM mdod.Usage " +
                        "INNER JOIN mdod.Substance ON mdod.Usage.substanceId = mdod.Substance.id " +
                        "WHERE mdod.Usage.email = ? " +
                        "ORDER BY mdod.Usage.usedAt DESC;", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            console.log(error);
                        } else {
                            res.status(200).json(rows);
                        }
                    });
                }
            });
        });
    })
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            } else {
                const email = payload.sub;
                const location = req.body.location;
                const amount = req.body.amount;
                const cause = req.body.cause;
                const mood = req.body.mood;
                const substanceId = req.body.substanceId;

                const usage = new Usage(substanceId, location, cause, amount, mood);

                db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                    if (rows.length < 1) {
                        const error = Errors.forbidden();
                        res.status(error.code).json(error);

                    } else {
                        if (usage._substanceId) {
                            db.query("INSERT INTO mdod.Usage" +
                                "(email, substanceId, location, cause, amount, mood) VALUES(?, ?, ?, ?, ?, ?)",
                                [email, usage._substanceId, usage._location, usage._cause, usage._amount, usage._mood], (error, result) => {
                                    if (error) {
                                        console.log(error);
                                        const err = Errors.conflict();
                                        res.status(err.code).json(err);
                                        return;
                                    }

                                    res.status(201).json({
                                        usageId: result.insertId,
                                        message: "Usage aangemaakt",
                                        notification: "Je hebt gebruikt. Neem contact op met je behandelaar."
                                    })
                                })
                        } else {
                            res.status(400).json({"message": "ALLES KAPOT"});
                        }
                    }
                });
            }
        });
    })
    .delete((req, res) => {
        // Get the token from the request
        const token = global.stripBearerToken(req.header('Authorization'));

        // Decode the token.
        auth.decodeToken(token, (error, payload) => {
            // If token is not valid. Return noValidToken error to the user
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            } else {

                // Get the usageId from the request. The usage with this id wil be deleted
                const usageId = req.params.usageId;

                // Get the email of the person who would like to delete the usage.
                const email = payload.sub;

                db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                    if (rows.length < 1) {
                        const error = Errors.forbidden();
                        res.status(error.code).json(error);
                    } else {
                        db.query("DELETE FROM mdod.Usage WHERE id = ? AND email = ?", [usageId, email], (error, result) => {
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

                            res.status(200).json({
                                message: "Usage verwijderd."
                            });
                        });
                    }
                });
            }
        });
    })
    .put((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            } else {

                // Get the email of the user that would like to update the usage.
                const email = payload.sub;

                // Get the id of the usage that needs to be updated.
                const usageId = req.params.usageId || '';

                // Get the new description.
                const cause = req.body.cause || '';
                const location = req.body.location || '';

                db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                    if (rows.length < 1) {
                        const error = Errors.forbidden();
                        res.status(error.code).json(error);
                    } else {
                        db.query("UPDATE mdod.Usage SET location = ?, cause = ?" +
                            "WHERE id = ? AND email = ?", [location, cause, usageId, email], (error, result) => {
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
                                    message: "Usage geüpdated."
                                })
                            }
                        })
                    }
                });
            }
        });
    });

//Get amount of days clean from logged in client
router.get('/clean/status', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (error, payload) => {
        if (error) {
            console.log(error);
            const err = Errors.noValidToken();
            res.status(err.code).json(err);
        }
        else {
            const email = payload.sub;
            db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                } else {
                    db.query("SELECT DATEDIFF(CURDATE(), MAX(mdod.`Usage`.usedAt)) AS daysClean " + "FROM mdod.Usage " + "INNER JOIN mdod.Substance ON mdod.Usage.substanceId = mdod.Substance.id " + "WHERE mdod.Usage.email = ?;", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(200).json(err);
                        } else {
                            const daysClean = rows[0].daysClean;
                            res.status(200).json({
                                "daysClean": daysClean
                            })
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;