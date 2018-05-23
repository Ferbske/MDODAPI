const moment = require('moment');

class Error {
    constructor(message, code) {
        this.message = message;
        this.code = code;
        this.timestamp = moment().format();
    }
}

module.exports = Error;