const Errors = require('./Errors');

/**
 * Domain object for a difficult moment for a client.
 * This domain object is validated with regex.
 *
 * Both description and lust are required.
 */
class Difficult_Moment {
    constructor(description, lust){
        if(!(
            description && /^(.|\s){0,280}$/.test(description) &&
            lust && /^[0-6]{0,2}$/.test(lust)
        )) {
            return Errors.badRequest();
        }

        this._description = description;
        this._lust = lust;
    }
}

module.exports = Difficult_Moment;