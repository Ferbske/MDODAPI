const Errors = require('./Errors');

class Note {
    constructor(description) {
        if (!(
            (description === '' || description && /^[^()@#%^&*+=~]{0,255}$/.test(description))
        )) {
            return Errors.badRequest();
        }

        this._description = description;
    };
}

module.exports = Note;