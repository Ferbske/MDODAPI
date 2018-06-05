const express = require('express');
const router = express.Router({});
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');

router.route('/')
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {

        })
    });

router.route('/all')
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            }

            db.query("SELECT * FROM mdod.Substance", (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                }

                if (rows.length < 1) {
                    const error = Errors.notFound();
                    res.status(error.code).json(error);
                }
                
                res.status(200).json(rows);
            })
        })
    });

module.exports = router;