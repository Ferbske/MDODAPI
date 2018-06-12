const express = require('express');
const router = express.Router({});
const auth = require('../auth/authentication');
const Errors = require('../models/Errors');
const db = require('../db/databaseConnector');
const global = require('../globalFunctions');
const Note = require('../models/Note');

router.route('/single_client')
/**
 * Get all the notes for a single client.
 */
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            // Get the email from payload.
            const email = payload.sub || '';

            // Check if email from token is a psychologist email.
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.affectedRows < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                const clientEmail = req.body.email || '';

                db.query("SELECT EMAIL FROM mdod.Client WHERE email = ?;", [clientEmail], (error, rows, fiels) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    if (rows.affectedRows < 1) {
                        const error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }

                    db.query("SELECT * FROM mdod.Note WHERE email = ?;", [clientEmail], (error, rows, fields) => {
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
                });
            })
        })
    });

router.route('/')
/**
 * Create a note for a single client.
 */
    .post((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            // Get the email from payload.
            const email = payload.sub || '';

            // Check if email from token is a psychologist email.
            db.query("SELECT email FROM mdod.Psychologist WHERE email = ?;", [email], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.affectedRows < 1) {
                    const error = Errors.forbidden();
                    res.status(error.code).json(error);
                    return;
                }

                const clientEmail = req.body.email || '';

                db.query("SELECT EMAIL FROM mdod.Client WHERE email = ?;", [clientEmail], (error, rows, fiels) => {
                    if (error) {
                        console.log(error);
                        const err = Errors.conflict();
                        res.status(err.code).json(err);
                        return;
                    }

                    if (rows.affectedRows < 1) {
                        const error = Errors.notFound();
                        res.status(error.code).json(error);
                        return;
                    }

                    const description = req.body.description || '';

                    const note = new Note(description);
                    if (note._description) {
                        db.query("INSERT INTO mdod.Note(email, description) VALUES(?, ?);", [clientEmail, description], (error, result) => {
                            if (error) {
                                console.log(error);
                                const err = Errors.conflict();
                                res.status(err.code).json(err);
                                return;
                            }

                            if (rows.affectedRows < 1) {
                                const error = Errors.forbidden();
                                res.status(error.code).json(error);
                                return;
                            }

                            res.status(201).json({
                                message: "Notitie aangemaakt."
                            })
                        })
                    } else {
                        res.status(note.code).json(note);
                    }
                });
            })
        })
    });

module.exports = router;