const Errors = require('./Errors');

class Goal {
    constructor(description) {
        if(!(
            description && /^.{0,280}$/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._description = description;
    }
}

module.exports = Goal;