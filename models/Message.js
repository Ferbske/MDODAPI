const Errors = require('./Errors');
const global = require('../globalFunctions');

class Message {
    constructor(message) {
        if (!(
            message && /^(.|\s){0,1000}/.test(message)
        )) {
            return Errors.badRequest();
        }

        this._message = global.checkEmoji(message);
    }
}

module.exports = Message;