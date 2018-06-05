const Errors = require('./Errors');

class Difficult_Moment {
    constructor(lust, description){
        if(!(
            description && /^(.|\s){0,280}$/.test(description) &&
            lust && /^[0-9]*$/.test(lust)
        )) {
            return Errors.badRequest();
        }

        this._description = description;
        this._lust = lust;
    }
}

module.exports = Difficult_Moment;