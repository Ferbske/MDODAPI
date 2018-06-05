const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');

//Routing files
const goals = require('./goals');
const risks = require('./risks');
const difficult_moment = require('./difficult_moments');
const addiction = require('./addiction');
const global = require('../globalFunctions');
const usage = require('./usage');

//Routers for goals and risks and difficult moments
router.use('/goal', goals);
router.use('/risk', risks);
router.use('/addiction', addiction);
router.use('/difficult_moment', difficult_moment);
router.use('/usage', usage);

/*
 * Role routes
 */

//Get all by role
router.get('/all/:role', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const role = req.params.role;
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {

            //Get all clients
            if (role === 'client') {
                const email = payload.sub;

                //Verify email
                db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {

                    //Query/DB Error
                    if (error) {
                        const err = Errors.unknownError();
                        res.status(err.code).json(err);
                        return;
                    }

                    //No results
                    if (rows.length < 1) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }

                    //Get all clients
                    if (rows.length > 0) {
                        db.query("SELECT email, firstname, infix, lastname FROM mdod.Client", [email], (error, rows) => {

                            //Query/DB Error
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }

                            //No results
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }

                            //Return results
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

//Get Client from Psychologist
router.post('/specific/:role', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
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

                //Get Psychologist email
                db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {

                    //DB/Query Error
                    if (error) {
                        const err = Errors.unknownError();
                        res.status(err.code).json(err);
                        return;
                    }

                    //No results
                    if (rows.length < 1) {
                        let error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }

                    //Select Client
                    if (rows.length > 0) {
                        db.query("SELECT email, contact, phonenumber, birthday, city, adress, zipcode, firstname, infix, lastname FROM mdod.Client WHERE email = ?;", [client_email], (error, rows) => {
                            // DB/Query Error
                            if (error) {
                                const err = Errors.unknownError();
                                res.status(err.code).json(err);
                                return;
                            }

                            //No results
                            if (rows.length < 1) {
                                let error = Errors.notFound();
                                res.status(error.code).json(error);
                                return;
                            }

                            //Return result
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

//Add Psychologist to Client
router.put('/pickclient', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {
            const email = payload.sub;
            const client_email = req.body.email || "";

            //Select Psychologist email
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows) => {

                // DB/Query Error
                if (error) {
                    console.log(error);
                    const err = Errors.unknownError();
                    res.status(err.code).json(err);
                    return;
                }

                //No results
                if (rows.length < 1) {
                    let error = Errors.notFound();
                    res.status(error.code).json(error);
                } else if (rows.length > 0) {

                    //Select Client email
                    db.query("SELECT email FROM mdod.Client WHERE email = ?;", [client_email], (error, rows) => {

                        // DB/Query Error
                        if (error) {
                            console.log(error);
                            const err = Errors.unknownError();
                            res.status(err.code).json(err);
                        }

                        //No results
                        if (rows.length < 1) {
                            let error = Errors.notFound();
                            res.status(error.code).json(error);
                        } else if (rows.length > 0) {

                            //Add Psychologist to Client
                            db.query("UPDATE mdod.Client SET contact = ? WHERE email = ?", [email, client_email], (error, result) => {
                                if (error) {
                                    console.log(error);
                                    const err = Errors.unknownError();
                                    res.status(err.code).json(err);
                                }
                                res.status(202).json({
                                    message: "Client Aangepast"
                                })
                            });
                        }
                    });
                }
            });
        }
    });
});

//Get clients from a psychologist
router.get('/clients-by-psychologist', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    const data = auth.decodeToken(token, (err, payload) => {
        if (err) {
            console.log('Error handler: ' + err.message);
            let error = Errors.noValidToken();
            res.status(error.code).json(error);
        } else {

            //Get Client email
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