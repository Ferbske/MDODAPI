const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Goal = require('../models/Goal');
const global = require('../globalFunctions');

router.route('/:goalId?')
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

            //Check if client
            db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                } else {
                    db.query("SELECT goalId, description, isCompleted FROM mdod.Goal WHERE email = ?;", [email], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        }
                        res.status(200).json(rows);
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
            }
            const email = payload.sub;
            const description = req.body.description || '';

            const goal = new Goal(description);

            db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                } else {
                    if (goal._description) {
                        db.query("INSERT INTO mdod.Goal(email, description) VALUES(?, ?)", [email, goal._description], (error, result) => {
                            if (error) {
                                console.log(error);
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }

                            res.status(201).json({
                                goalId: result.insertId,
                                message: "Goal aangemaakt"
                            })
                        })
                    } else {
                        res.status(goal.code).json(goal);
                    }
                }
            });
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
                return;
            }

            // Get the goalId from the request. The goal with this id wil be deleted
            const goalId = req.params.goalId;

            // Get the email of the person who would like to delete the goal.
            const email = payload.sub;

            db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                } else {
                    db.query("DELETE FROM mdod.Goal WHERE goalId = ? AND email = ?", [goalId, email], (error, result) => {
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
                            message: "Goal verwijderd."
                        })
                    })
                }
            });
        });
    })
    .put((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the email of the user that would like to update the goal.
            const email = payload.sub;

            // Get the id of the goal that needs to be updated.
            const goalId = req.params.goalId || '';

            // Get the new description.
            const description = req.body.description || '';

            // The new goal.
            const goal = new Goal(description);

            db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                } else {
                    db.query("UPDATE mdod.Goal SET description = ? WHERE goalId = ? AND email = ?", [goal._description, goalId, email], (error, result) => {
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

                        res.status(202).json({
                            message: "Goal geüpdated."
                        })
                    });
                }
            });
        });
    });

router.put("/update/status", (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    auth.decodeToken(token, (error, payload) => {
        if (error) {
            const err = Errors.noValidToken();
            res.status(err.code).json(err);
            return;
        }

        const email = payload.sub;

        const isCompleted = req.body.isCompleted;

        const goalId = req.body.goalId;

        db.query("SELECT email FROM mdod.Client WHERE email = ?", [email], (err, rows, fields) => {
            if (rows.length < 1) {
                const error = Errors.forbidden();
                res.status(error.code).json(error);
                return;
            } else {
                db.query("UPDATE mdod.Goal SET isCompleted = ? where email = ? AND goalId = ?", [isCompleted, email, goalId], (error, result) => {
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

                    res.status(202).json({
                        message: "Status geüpdate"
                    });
                });
            }
        });
    });
});
module.exports = router;