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

            const usageId = req.params.usageId;
            console.log(usageId)
            db.query("SELECT substanceId, description, usedAt FROM mdod.Usage WHERE id = ?;", [usageId], (error, rows, fields) => {
                if (error) {
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                } else {
                    const substanceId = rows[0].substanceId;
                    const description = rows[0].description;
                    const usedAt = rows[0].usedAt;

                    console.log(description)

                    db.query("SELECT type, name FROM mdod.Substance WHERE id = ?;", [substanceId], (error, rows, fields) => {
                        if (error) {
                            const err = Errors.conflict();
                            res.status(err.code).json(err);
                            return;
                        } else {
                            const type = rows[0].type;
                            const name = rows[0].name;

                            res.status(200).json({
                                "type": type,
                                "name": name,
                                "usedAt": usedAt,
                                "description": description
                            });
                        }
                    });
                }
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
            const substanceId = req.body.substanceId;

            const usage = new Usage(substanceId, description);

            if (usage._description) {
                db.query("INSERT INTO mdod.Usage(email, substanceId, description) VALUES(?, ?, ?)", [email, usage._substanceId, usage._description], (error, result) => {
                    if (error) {
                        console.log(error);rs
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
            db.query("DELETE FROM mdod.Usage WHERE id = ? AND email = ?", [usageId, email], (error, result) => {
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

            db.query("UPDATE mdod.Usage SET description = ? WHERE id = ? AND email = ?", [description, usageId, email], (error, result) => {
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