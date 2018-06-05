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
                    return;
                }
                if (rows.length > 0) {
                    const lust = req.body.lust || '';
                    const description = req.body.description || '';

                    const moment = new Difficult_Moment(description, lust);

                    if(moment._description){
                        db.query("INSERT INTO mdod.Difficult_moment(email, description, lust) VALUES(?, ? ,?)", [email, description, lust], (error, result) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }
                            res.status(201).json({message: "Moeilijk moment aangemaakt"})
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
                    return;
                }
                if (rows.length > 0) {
                    db.query("SELECT lust, description, date_lust FROM mdod.Difficult_moment WHERE email = ?;", [email], (error, rows) => {
                        if (error) {
                            const err = Errors.unknownError();
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

module.exports = router;