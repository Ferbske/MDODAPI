const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Domain object for a client's usage of substances.
 * This domain object is validated with regex.
 * All constructor parameters are required.
 */
class Usage {
    constructor(substanceId, location, cause, amount, mood) {
        if(!(
            substanceId && /^\d*$/.test(substanceId) &&
            location && /^(.|\s){0,80}$/.test(location) &&
            cause && /^(.|\s){0,80}$/.test(cause) &&
            amount && /^[0-9]{0,5}$/.test(amount) &&
            mood && /^[1-5]$/.test(mood)
        )) {
            return Errors.badRequest();
        }

        this._substanceId = substanceId;
        this._location = global.checkEmoji(location);
        this._cause = global.checkEmoji(cause);
        this._amount = amount;
        this._mood = mood;
      }
}

module.exports = Usage;