const Errors = require('./Errors');
const moment = require('moment');

class Usage {
    constructor(description) {
        if(!(
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._description = description;
        this._usedAt = moment().format('YYYY mm dd hh:mm:ss');
    }
}

module.exports = Usage;