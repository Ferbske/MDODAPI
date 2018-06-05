const express = require('express');
const router = express.Router({});

router.route('/')
/**
 * Get all the addictions for a single client.
 */
    .get((req, res) => {
        const token = global.stripBearerToken(req.header('Authorization'));

        auth.decodeToken(token, (error, payload) => {
            const email = payload.sub;

            db.query("SELECT mdod.Addiction.id, mdod.Addiction.substanceId, mdod.Addiction.email, mdod.Substance.`type`, mdod.Substance.name, mdod.Substance.measuringUnit\n" +
                "FROM mdod.Addiction \n" +
                "\tINNER JOIN mdod.Substance ON mdod.Addiction.substanceId = mdod.Substance.id\n" +
                "\tWHERE mdod.Addiction.email = '?';", [email], (error, rows, fields) => {
                if (error) {
                    console.log(error);
                    const err = Errors.conflict();
                    res.status(err.code).json(err);
                    return;
                }

                if (rows.length < 1) {
                    const error = Errors.notFound();
                    res.status(error.code).json(error);
                    return;
                }

                res.status(200).json(rows);
            })
        })
    });
module.exports = router;