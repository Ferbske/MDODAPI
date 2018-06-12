const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');
const Difficult_Moment = require('../models/Difficult_Moment');

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
                    const lust = req.body.lust || '';
                    const prevention = req.body.prevention || '';
                    const description = req.body.description || '';
                    const substance = req.body.substance || '';
                    const moment = new Difficult_Moment(description, lust);

                    if(moment._description){
                        db.query("SELECT id FROM mdod.Substance WHERE name = ?", [substance], (error, rows, fields) => {
                            if (error) {
                                console.log(error);
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }else{
                                const substance_id = rows[0].id;
                                db.query("INSERT INTO mdod.Difficult_moment(email, description, prevention, lust, substance_id) VALUES(?, ?, ?, ?, ?)", [email, description, prevention, lust, substance_id], (error, result) => {
                                    if (error) {
                                        console.log(error);
                                        const err = Errors.conflict();
                                        res.status(err.code).json(err);
                                        return;
                                    }
                                    res.status(201).json({message: "Moeilijk moment aangemaakt"});
                                });
                            }
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
                            db.query("SELECT lust, description, prevention, date_lust, Substance.name FROM mdod.Difficult_moment LEFT JOIN mdod.Substance ON Difficult_moment.substance_id = Substance.id WHERE email = ? ORDER BY date_lust DESC;", [client_email], (error, rows) => {
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