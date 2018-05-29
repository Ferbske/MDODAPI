const express = require('express');
const router = express.Router({});
const config = require('../config');
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Goal = require('../models/Goal');

/**
 * Decode the token and return the payload.
 * @param res The response to print json if the decodeToken function fails
 * @param cb The callback function that will be called if the payload is successfully retrieved.
 */
function authDecodeToken(req, res, cb) {
    const token = req.header('X-Access-Token');
    auth.decodeToken(token, (error, payload) => {
        if (error) {
            console.log(error);
            const err = Errors.unauthorized();
            res.status(err.code).json(err);
            return;
        }

        cb(null, payload);
    })
}

router.route('/goals')
    .get((req, res) => {
        authDecodeToken(req, res, (error, payload) => {
            const email = payload.sub;
            db.query("SELECT description FROM mdod.Goals WHERE email = ?", [email], (error, rows, fields) => {
                res.status(200).json(rows);
            })
        })
    })
    .post((req, res) => {
        authDecodeToken(req, res, (error, payload) => {
            const email = payload.sub;
            const description = req.body.description || '';

            const goal = new Goal(description);

            if (goal._description) {
                // TODO: Check if goal exists.
                db.query("INSERT INTO mdod.Goals(email, description) VALUES(?, ?)", [email, goal._description], (error, result) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    res.status(201).json({
                        "message": "Goal aangemaakt"
                    })
                })
            } else {
                res.status(goal.code).json(goal);
            }
        })
    });


module.exports = router;