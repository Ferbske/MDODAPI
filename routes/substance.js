const express = require('express');
const router = express.Router({});
const global = require('../globalFunctions');
const db = require('../db/databaseConnector');
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');

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
                res.status(200).json(rows);
            })
        })
    });

module.exports = router;