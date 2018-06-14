const Errors = require('./Errors');

class Usage {
    constructor(substanceId, location, cause, amount, mood) {
        if(!(
            location && /^(.|\s){0,80}$/.test(location) &&
            cause && /^(.|\s){0,80}$/.test(cause) &&
            amount && /^[0-9]{0,5}$/.test(amount)
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