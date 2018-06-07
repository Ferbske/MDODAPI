const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Mood = require('../models/Mood');
const global = require('../globalFunctions');

router.post('/', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email FROM mdod.Client WHERE email = ?;", [email], (error, rows) => {
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
                    const value = req.body.value || '';
                    const description = req.body.description || '';
                    const mood = new Mood(value, description);

                    if(mood._description){
                        db.query("INSERT INTO mdod.Mood(email, value, description) VALUES(?, ?, ?)", [email, value, description], (error, result) => {
                            if (error) {
                                console.log(error);
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }
                            res.status(201).json({message: "Gemoedstoestand aangemaakt"})
                        });
                    }
                }
            });
        }
    });
});

router.get('/', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email FROM mdod.Client WHERE email = ?;", [email], (error, rows) => {
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
                    db.query("SELECT value, description, addedDate FROM mdod.Mood WHERE email = ? ORDER BY addedDate DESC;", [email], (error, rows) => {
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

router.post('/client', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {
                if (error) {
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                }
                else if(rows.length > 0) {
                    const client_email = req.body.email || '';
                    db.query("SELECT email FROM mdod.Client WHERE email = ?;", [client_email], (error, rows) => {
                        if (error) {
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                            return;
                        }
                        if (rows.length < 1) {
                            let error = Errors.notFound();
                            res.status(error.code).json(error);
                        } else if(rows.length > 0) {
                            db.query("SELECT value, description, addedDate FROM mdod.Mood WHERE email = ? ORDER BY addedDate DESC;", [client_email], (error, rows) => {
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
        }
    });
});
module.exports = router;