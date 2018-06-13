const Errors = require('./Errors');

class Note {
    constructor(title, description) {
        if (!(
            (title === '' || title && /^[^()+=@#$%^&*~]$/.test(title))
            (description === '' || description && /^[^()@#%^&*+=~]$/.test(description))
        )) {
            return Errors.badRequest();
        }

        this._description = description;
    };
}

module.exports = Note;