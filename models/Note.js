const Errors = require('./Errors');

class Note {
    constructor(description) {
        if (!(
            (description === '' || description && /^[^()@#%^&*+=~]/.test(description))
        )) {
            return Errors.badRequest();
        }
    }
}

module.exports = Note;