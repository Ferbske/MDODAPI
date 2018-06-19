const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');
const Difficult_Moment = require('../models/Difficult_Moment');

/**
 * Create a difficult moment as client.
 */
router.post('/', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;

            global.checkIfEmailIsClientEmail(email, (error, clientRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    const lust = req.body.lust || '';
                    const prevention = req.body.prevention || '';
                    const description = req.body.description || '';
                    const substance = req.body.substance || '';
                    const difficultMoment = new Difficult_Moment(description, prevention, lust);

                    if(difficultMoment._description){
                        db.query("SELECT id FROM mdod.Substance WHERE name = ?", [substance], (error, rows, fields) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }else{
                                const substance_id = rows[0].id;
                                db.query("INSERT INTO mdod.Difficult_moment(email, description, prevention, lust, substance_id) VALUES(?, ?, ?, ?, ?)", [email, difficultMoment._description, difficultMoment._prevention, difficultMoment._lust, substance_id], (error, result) => {
                                    if (error) {
                                        const err = Errors.conflict();
                                        res.status(err.code).json(err);
                                        return;
                                    }
                                    res.status(201).json({message: "Moeilijk moment aangemaakt."});
                                });
                            }
                        });
                    }
                }
            });
        }
    });
});

/**
 * Select all the difficult moments for a single client the email from the bearer token is used.
 */
router.get('/', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;

            global.checkIfEmailIsClientEmail(email, (error, clientRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    db.query("SELECT lust, description, prevention, date_lust, Substance.`id`, Substance.name FROM mdod.Difficult_moment LEFT JOIN mdod.Substance ON Difficult_moment.substance_id = Substance.id WHERE email = ? ORDER BY date_lust DESC;", [email], (error, rows) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        }
                        res.status(200).json(rows);
                    });
                }
            });
        }
    });
});

/**
 * Get the difficult moments for a single client on the psychologist webapp.
 * The email of the client will be received from the request body.
 */
router.post('/client', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (err, payload) => {
        if (err) {
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;

            global.checkIfEmailIsPsychologistEmail(email, (error, psychRows) => {
                if (error) {
                    res.status(error.code).json(error);
                    return;
                } else {
                    const client_email = req.body.email || '';

                    global.checkIfEmailIsClientEmail(client_email, (error, clientRows) => {
                        if (error) {
                            res.status(error.code).json(error);
                            return;
                        } else {
                            db.query("SELECT lust, description, prevention, date_lust, Substance.name FROM mdod.Difficult_moment LEFT JOIN mdod.Substance ON Difficult_moment.substance_id = Substance.id WHERE email = ? ORDER BY date_lust DESC;", [client_email], (error, rows) => {
                                if (error) {
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
                    });
                }
            });
        }
    });
});
module.exports = router;