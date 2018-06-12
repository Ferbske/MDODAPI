const Errors = require('./Errors');
const moment = require('moment');

class Usage {
    constructor(substanceId, location, cause, amount, mood) {
        if(!(
            location && /^(.|\s){0,80}$/.test(location) &&
            cause && /^(.|\s){0,80}$/.test(cause)
        )) {
            return Errors.badRequest();
        }

        this._substanceId = substanceId;
        this._location = location;
        this._cause = cause;
        this._amount = amount;
        this._mood = mood;
      }
}

module.exports = Usage;