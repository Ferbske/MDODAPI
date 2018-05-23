const config = require('../config');
const moment = require('moment');
const jwt = require('jwt-simple');
const Errors = require('../models/Errors');

function encodeToken(email) {
    const payload = {
        exp: moment().add(10, 'days').unix(),
        sub: email,
        iat: moment().unix()
    };

    return jwt.encode(payload, config.secretKey, "HS512", {});
}

function decodeToken(token, cb) {
    try {
        const payload = jwt.decode(token, config.secretKey, null, "HS512");

        const now = moment().unix();

        if (now > payload.exp) {
            const error = Errors.noValidToken();
            cb(error, null);
        }

        cb(null, payload);
    } catch (error) {
        cb(error, null);
    }
}

module.exports = {
    encodeToken,
    decodeToken
};