const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Domain object for a client's mood.
 * Both constructor parameters are required.
 */
class Mood {
    constructor(value, description) {
        if(!(
            value && /^[0-6]{0,3}$/.test(value) &&
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._value = value;
        this._description = global.checkEmoji(description);
    }
}

module.exports = Mood;