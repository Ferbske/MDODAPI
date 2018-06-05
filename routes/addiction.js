const express = require('express');
const router = express.Router({});
const global = require('../globalFunctions');
const auth = require('../auth/authentication');
const db = require('../db/databaseConnector');
const Errors = require('../models/Errors');

router.route('/')
/**
 * Get all the addictions for a single client.
 */
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            const email = payload.sub;

            db.query("SELECT mdod.Addiction.id, mdod.Addiction.substanceId, mdod.Addiction.email, mdod.Substance.`type`, mdod.Substance.name, mdod.Substance.measuringUnit\n" +
                "FROM mdod.Addiction \n" +
                "\tINNER JOIN mdod.Substance ON mdod.Addiction.substanceId = mdod.Substance.id\n" +
                "\tWHERE mdod.Addiction.email = ?;", [email], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.length < 1) {
                    const error = Errors.notFound();
                    res.status(error.code).json(error);
                    return;
                }

                res.status(200).json(rows);
            })
        })
    })
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
            }

            // Get psychologist email;
            const psychologistEmail = payload.sub;

            // Check if the psychologist exists;
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [psychologistEmail], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.length < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                }

                // Get the client email.
                const clientEmail = req.body.email || '';

                // Check if the client exists.
                db.query("SELECT email FROM mdod.`Client` WHERE email = ?;", [clientEmail], (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    if (rows.length < 1) {
                        const error = Errors.notFound();
                        res.status(error.code).json(error);
                    }

                    const substanceId = req.body.substanceId || '';
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
                })
            });
        })
    });
module.exports = router;