const Errors = require('./Errors');

class Mood {
    constructor(value, description) {
        if(!(
            value && /^[0-9]*$/.test(value) &&
            (description = '' ||description && /^(.|\s){0,280}$/.test(description))
        )) {
            return Errors.badRequest();
        }

        this._value = value;
        this._description = description;
    }
}

module.exports = Mood;