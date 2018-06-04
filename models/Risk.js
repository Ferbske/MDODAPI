const Errors = require('./Errors');

class Risk {
    constructor(description) {
        if(!(
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._description = description;
    }
}

module.exports = Risk;