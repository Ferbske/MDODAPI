const Errors = require('./Errors');
const moment = require('moment');

class Mood {
    constructor(value, description) {
        if(!(
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._value = value;
        this._description = description;
    }
}

module.exports = Mood;