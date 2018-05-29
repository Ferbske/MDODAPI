const express = require('express');
const router = express.Router({});
const config = require('../config');
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Goal = require('../models/Goal');

router.route('/goals/:goalId?')
    .get((req, res) => {
        const token = req.header('X-Access-Token');
        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            const email = payload.sub;
            db.query("SELECT goalId, description FROM mdod.Goals WHERE email = ?", [email], (error, rows, fields) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }
                res.status(200).json(rows);
            });
        });
    })
    .post((req, res) => {
        const token = req.header('X-Access-Token') || '';
        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            }
            const email = payload.sub;
            const description = req.body.description || '';

            const goal = new Goal(description);

            if (goal._description) {
                db.query("INSERT INTO mdod.Goals(email, description) VALUES(?, ?)", [email, goal._description], (error, result) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    res.status(201).json({
                        message: "Goal aangemaakt"
                    })
                })
            } else {
                res.status(goal.code).json(goal);
            }
        });
    });

router.delete("/goals/:goalId", (req, res) => {
    // Get the token from the request
    const token = req.header('X-Access-Token') || '';

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
        db.query("DELETE FROM mdod.Goals WHERE goalId = ? AND email = ?", [goalId, email], (error, result) => {
            if (error) {
                console.log(error);
                const err = Errors.conflict();
                res.status(err.code).json(err);
                return;
            }

            if (result.affectedRows < 1) {
                console.log("0 rows affected");
                const error = Errors.forbidden();
                res.status(error.code).json(error);
                return;
            }

            res.status(200).json({
                message: "Goal verwijderd."
            })
        })
    })
});

module.exports = router;