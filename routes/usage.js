const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const Usage = require('../models/Usage');
const global = require('../globalFunctions');

router.route('/:usageId?')
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            const email = payload.sub;
            db.query("SELECT usageId, description, usedAt FROM mdod.Usage WHERE email = ?;", [email], (error, rows, fields) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }
                res.status(200).json(rows);
            });
        });
    })
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
            }
            const email = payload.sub;
            const description = req.body.description || '';

            const usage = new Usage(description);

            if (usage._description) {
                db.query("INSERT INTO mdod.Usage(email, description) VALUES(?, ?)", [email, usage._description], (error, result) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    res.status(201).json({
                        usageId: result.insertId,
                        message: "Usage aangemaakt"
                    })
                })
            } else {
                res.status(usage.code).json(usage);
            }
        });
    })
    .delete((req, res) => {
        // Get the token from the request
        const token = global.stripBearerToken(req.header('Authorization'));

        // Decode the token.
        auth.decodeToken(token, (error, payload) => {
            // If token is not valid. Return noValidToken error to the user
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the usageId from the request. The usage with this id wil be deleted
            const usageId = req.params.usageId;

            // Get the email of the person who would like to delete the usage.
            const email = payload.sub;
            db.query("DELETE FROM mdod.Usage WHERE usageId = ? AND email = ?", [usageId, email], (error, result) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (result.affectedRows < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                res.status(200).json({
                    message: "Usage verwijderd."
                })
            })
        })
    })
    .put((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            if (error) {
                console.log(error);
                const err = Errors.noValidToken();
                res.status(err.code).json(err);
                return;
            }

            // Get the email of the user that would like to update the usage.
            const email = payload.sub;

            // Get the id of the usage that needs to be updated.
            const usageId = req.params.usageId || '';

            // Get the new description.
            const description = req.body.description || '';

            // The new usage.
            const usage = new Usage(description);

            db.query("UPDATE mdod.Usage SET description = ? WHERE usageId = ? AND email = ?", [usage._description, usageId, email], (error, result) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (result.affectedRows < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                res.status(202).json({
                    message: "Usage geüpdated."
                })
            })
        });
    });

module.exports = router;