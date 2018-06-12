const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');
const PhoneNumber = require('../models/PhoneNumber');

router.get('/', (req, res) => {
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
                    if (rows[0].contact === null) {
                        db.query("SELECT id, PNfirm, PNbuddy, PNice FROM mdod.PhoneNumbers WHERE email = ?;", [email], (err, rows) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }
                            res.status(200).json(rows);
                        })
                    } else {
                        db.query("SELECT id, PNfirm, Psychologist.phonenumber, PNbuddy, PNice FROM mdod.PhoneNumbers LEFT JOIN mdod.`Client` ON PhoneNumbers.email = Client.email LEFT JOIN mdod.Psychologist ON Psychologist.email = Client.contact WHERE Client.email = ?;", [email], (err, rows) => {
                            if (error) {
                                const err = Errors.conflict();
                                res.status(err.code).json(err);

                            } else{
                                res.status(200).json(rows);
                            }
                        });
                    }
                }
            });
        }
    });
});

router.put('/', (req, res) => {
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

                    const id = req.body.id || '';
                    const firm = new PhoneNumber(req.body.firm) || '';
                    const buddy = new PhoneNumber(req.body.buddy) || '';
                    const ice = new PhoneNumber(req.body.ice) || '';

                    if ((firm._phonenumber || firm._phonenumber === '') && (buddy._phonenumber || buddy._phonenumber === '') && (ice._phonenumber || ice._phonenumber === '')) {
                        if(id === ''){
                            db.query("REPLACE INTO mdod.PhoneNumbers (email, PNfirm, PNbuddy, PNice) VALUES ( ?, ?, ?, ?);", [email, firm._phonenumber, buddy._phonenumber, ice._phonenumber], (error, result) => {
                                if (error) {
                                    console.log(error);
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
                                }
                                res.status(202).json({message: "Phonenumber changed"})
                            });
                        } else {
                            db.query("REPLACE INTO mdod.PhoneNumbers (id ,email, PNfirm, PNbuddy, PNice) VALUES (?, ?, ?, ?, ?);", [id, email, firm._phonenumber, buddy._phonenumber, ice._phonenumber], (error, result) => {
                                if (error) {
                                    console.log(error);
                                    const err = Errors.conflict();
                                    res.status(err.code).json(err);
                                }else{
                                    res.status(202).json({message: "Phonenumber changed"})
                                }
                            });
                        }
                    } else {
                        const err = Errors.badRequest();
                        res.status(err.code).json(err);
                    }
                }
            });
        }
    });
});

module.exports = router;