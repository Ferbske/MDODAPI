const Errors = require('./Errors');

class Note {
    constructor(description) {
        if (!(
            (description === '' || description && /^[^()@#%^&*+=~]/.test(description))
        )) {
            return Errors.badRequest();
        }

        this._description = description;
    };
}

module.exports = Note;