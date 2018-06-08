const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Usage = require('../models/Usage');
const global = require('../globalFunctions');


//Psychologist endpoints
router.post('/', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    auth.decodeToken(token, (error, payload) => {
        if (error) {
            console.log(error);
            const err = Errors.noValidToken();
            res.status(err.code).json(err);
            return;
        }

        const psychEmail = payload.sub;
        const clientEmail = req.body.email;

        db.query("SELECT email FROM mdod.Psychologist WHERE email = ?", [psychEmail], (err, rows, fields) => {
            if (rows.length < 1) {
                const error = Errors.forbidden();
                res.status(error.code).json(error);
                return;
            } else {
                if (clientEmail) {
                    db.query("SELECT mdod.Usage.id, mdod.Usage.substanceId, " +
                    "mdod.Substance.name, mdod.Substance.measuringUnit, mdod.Usage.usedAt, " +
                    "mdod.Usage.location, mdod.Usage.cause, mdod.Usage.amount, mdod.Usage.mood " +
                    "FROM mdod.Usage " +
                    "INNER JOIN mdod.Substance ON mdod.Usage.substanceId = mdod.Substance.id " +
                    "WHERE mdod.Usage.email = ? " +
                    "ORDER BY mdod.Usage.usedAt DESC;", [clientEmail], (error, rows, fields) => {
                            if (error) {
                                console.log(error);
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }
                            res.status(200).json(rows);
                        });
                } else {
                    res.status(400).json({
                        message: "Email invalid"
                    });
                }
            }
        });
    });
});

router.post('/clean/status', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (error, payload) => {
        if (error) {
            console.log(error);
            const err = Errors.noValidToken();
            res.status(err.code).json(err);
            return;
        }

        const psychEmail = payload.sub;
        const clientEmail = req.body.email || '';

        db.query("SELECT email FROM mdod.Psychologist WHERE email = ?", [psychEmail], (err, rows, fields) => {
            if (rows.length < 1) {
                const error = Errors.forbidden();
                res.status(error.code).json(error);
                return;
            } else {
                db.query("SELECT DATEDIFF(CURDATE(), MAX(mdod.`Usage`.usedAt)) AS daysClean " +
                    "FROM mdod.Usage " +
                    "INNER JOIN mdod.Substance ON mdod.Usage.substanceId = mdod.Substance.id " +
                    "WHERE mdod.Usage.email = ?;", [clientEmail], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(200).json(err);
                            return;
                        } else {
                            const daysClean = rows[0].daysClean;

                            res.status(200).json({
                                "daysClean": daysClean
                            });
                        }
                    });
            }
        });
    });
});


module.exports = router;