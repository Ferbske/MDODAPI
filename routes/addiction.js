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
            }

            const email = req.body.email || '';

            checkPsychAndClient(req, res, payload, email);

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
    });

router.route('/')
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

            // Get the client email.
            const clientEmail = req.body.email || '';

            checkPsychAndClient(req, res, payload, clientEmail);

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

            // Get the client email.
            const clientEmail = req.body.email || '';

            checkPsychAndClient(req, res, payload, clientEmail);

            const addictionId = req.body.id || '';
            const substanceId = req.body.substanceId || '';
            db.query("UPDATE mdod.Addiction SET substanceId = ?, email = ? WHERE id = ?", [substanceId, clientEmail, addictionId], (error, result) => {
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
                    message: "Verslaving geupdate"
                })
            })
        })
    });

function checkPsychAndClient(req, res, payload, clientEmail) {
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
            return;
        }


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
        })
    });
}

module.exports = router;