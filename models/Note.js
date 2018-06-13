const Errors = require('./Errors');

class Note {
    constructor(title, description) {
        if (!(
            (title === '' || title && /^[^()+=@#$%^&*~]{0,50}$/.test(title)) &&
            (description === '' || description && /^[^()@#%^&*+=~]{0,255}$/.test(description))
        )) {
            return Errors.badRequest();
        }

        this._title = title;
        this._description = description;
    };
}

module.exports = Note;