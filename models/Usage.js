const Errors = require('./Errors');
const moment = require('moment');

class Usage {
    constructor(substanceId, description) {
        if(!(
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._substanceId = substanceId;
        this._description = description;
    }
}

module.exports = Usage;