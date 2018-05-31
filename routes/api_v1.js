const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Goal = require('../models/Goal');
const Risk = require('../models/Risk');
const goals = require('./goals');
const risks = require('./risks');

router.use('/goal', goals);
router.use('/risk', risks);

//Role routes
router.get('/all/:role', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const role = req.params.role;
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            if (role === 'client') {
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
                        return;
                    }
                    if (rows.length > 0) {
                        db.query("SELECT email, firstname, infix, lastname FROM mdod.Client", [email], (error, rows) => {
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }
                            if (rows.length > 0) {
                                res.status(200).json(rows);
                            }
                        });
                    }
                });
            } else {
                const err = Errors.badRequest();
                res.status(err.code).json(err);
            }
        }
    });
});

router.post('/specific/:role', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const role = req.params.role;
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            if (role === 'client') {
                const email = payload.sub;
                const client_email = req.body.email || "";
                db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {
                    if (error) {
                        const err = Errors.unknownError();
                        res.status(err.code).json(err);
                        return;
                    }
                    if (rows.length < 1) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }
                    if (rows.length > 0) {
                        db.query("SELECT email, contact, phonenumber, birthday, city, adress, zipcode, firstname, infix, lastname FROM mdod.Client WHERE email = ?;", [client_email], (error, rows) => {
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }
                            if (rows.length > 0) {
                                res.status(200).json(rows);
                            }
                        });
                    }
                });
            } else {
                const err = Errors.badRequest();
                res.status(err.code).json(err);
            }
        }
    });
});

router.put('/pickclient', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            const client_email = req.body.email || "";
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                }
                else if (rows.length > 0) {
                    db.query("UPDATE mdod.Client SET contact = ? WHERE email = ?", [email, client_email], (error, result) => {
                        if (error) {
                            console.log(error);
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                        }
                        res.status(202).json({message: "Client Aangepast"});
                    });
                }
            });
        }
    });
});

router.get('/clients-by-psychologist', (req, res) => {
    const token = (req.header('X-Access-Token')) || '';
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            db.query("SELECT email, firstname, infix, lastname FROM mdod.Client WHERE contact = ?", [email], (error, rows) => {
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                }
                res.status(200).json(rows)
            });
        }
    });
});

module.exports = router;