const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Domain object for a client's risk.
 * a risk is a situation where the client could fall back to his/her alcohol or drugs.
 * Description is required and validated with regex.
 */
class Risk {
    constructor(description) {
        if(!(
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._description = description;

        global.checkEmoji(this._description);
    }

}

module.exports = Risk;