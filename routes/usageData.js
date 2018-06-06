const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Usage = require('../models/Usage');
const global = require('../globalFunctions');

//Psychologist endpoints
router.post('/', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));
    auth.decodeToken(token, (error) => {
        if (error) {
            console.log(error);
            const err = Errors.noValidToken();
            res.status(err.code).json(err);
        }
        const clientEmail = req.body.email || '';

        if (clientEmail) {
            db.query("SELECT mdod.Usage.email, mdod.`Usage`.substanceId, mdod.`Usage`.description, " +
                "mdod.`Usage`.usedAt FROM mdod.`Usage` WHERE email = ?", [clientEmail], (error, rows, fields) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }
                    res.status(200).json(rows)
                })
        } else {
            res.status(400).json({message: "geen valid email"})
        }
    });
});

router.post('/clean/status', (req, res) => {
    const token = global.stripBearerToken(req.header('Authorization'));

    auth.decodeToken(token, (error) => {
        if (error) {
            console.log(error);
            const err = Errors.noValidToken();
            res.status(err.code).json(err);
            return;
        }
        const clientEmail = req.body.email || '';

        db.query("SELECT DATEDIFF(CURDATE(), MAX(mdod.`Usage`.usedAt)) AS daysClean " +
            "FROM mdod.Usage " +
            "INNER JOIN mdod.Substance ON mdod.Usage.substanceId = mdod.Substance.id " +
            "WHERE mdod.Usage.email = ?;", [clientEmail], (error, rows, fields) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(200).json(err);
                } else {
                    const daysClean = rows[0].daysClean;

                    res.status(200).json({
                        "daysClean": daysClean
                    });
                }
            });
    });
});

module.exports = router;