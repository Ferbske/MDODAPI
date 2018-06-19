const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Domain object for a goal.
 * This object is validated with regex.
 * description is required.
 */
class Goal {
    constructor(description) {
        if(!(
            description && /^(.|\s){0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._description = global.checkEmoji(description);
    }
}

module.exports = Goal;