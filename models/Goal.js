const Errors = require('./Errors');

class Goal {
    constructor(description) {
        if(!(
            description && description.length <= 280 && /^.{3,280}/.test(description)
        )) {
            return Errors.badRequest();
        }

        this._description = description;
    }
}

module.exports = Goal;