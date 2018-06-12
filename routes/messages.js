const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');

// client
router.post('/client', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email, contact FROM mdod.Client WHERE email = ?;", [email], (error, rows, result) => {
                if (error) {
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                } else if (rows.length > 0) {
                    const psychEmail = rows[0].contact;
                    if (psychEmail != null) {
                        const message = req.body.message;
                        db.query("INSERT INTO mdod.Messages (email_client, email_psych, message) VALUES (?, ?, ?);", [email, psychEmail, message], (err, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                            } else {
                                res.status(200).json({message: "bericht verstuurd"});
                            }
                        });
                    } else {
                        res.status(400).json({message: "Berichten niet mogelijk, u bent niet de psycholoog, of de cliënt heeft nog geen psycholoog gekoppelt."})
                    }
                }
            });
        }
    });
});

router.get('/client', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email, contact FROM mdod.Client WHERE email = ?;", [email], (error, rows, result) => {
                if (error) {
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                }
                else if (rows.length > 0) {
                    db.query("SELECT email_psych, message, date FROM mdod.Messages WHERE email_client = ? ORDER BY date DESC", [email], (error, rows) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                        } else {
                            res.status(200).json(rows);
                        }
                    });
                }
            });
        }
    });
});

router.post('/psychologist', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, result) => {
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                } else if (rows.length > 0) {
                    const clientEmail = req.body.email;
                    db.query("SELECT email FROM mdod.Client WHERE email = ?;", [clientEmail], (error, rows) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }
                        if (rows.length < 1) {
                            let error = Errors.notFound();
                            res.status(error.code).json(error);
                        } else if (rows.length > 0) {
                            const message = req.body.message;
                            db.query("INSERT INTO mdod.Messages (email_client, email_psych, message) VALUES (?, ?, ?);", [clientEmail, email, message], (err, result) => {
                                if (error) {
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
                                } else {
                                    res.status(200).json({message: "bericht verstuurd"});
                                }
                            });
                        } else {
                            res.status(400).json({message: "Berichten niet mogelijk, u bent niet de psycholoog, of de cliënt heeft nog geen psycholoog gekoppelt."})
                        }
                    });
                }
            });
        }
    });
});

router.post('/get/psychologist', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, result) => {
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                } else if (rows.length > 0) {
                    const clientEmail = req.body.email;
                    db.query("SELECT email FROM mdod.Client WHERE email = ?;", [clientEmail], (error, rows) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }
                        if (rows.length < 1) {
                            let error = Errors.notFound();
                            res.status(error.code).json(error);
                        }else if (rows.length > 0){
                            db.query("SELECT email_psych, message, date FROM mdod.Messages WHERE email_client = ? ORDER BY date DESC", [email], (error, rows) => {
                                if (error) {
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
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