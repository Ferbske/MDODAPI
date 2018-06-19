const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Domain object for a psychologist's note to a client.
 * Both title and description constructor parameters are not required.
 */
class Note {
    constructor(title, description) {
        if (!(
            (title === '' || title && /^[^()+=@#$%^&*~]{0,50}$/.test(title)) &&
            (description === '' || description && /^[^()@#%^&*+=~]{0,255}$/.test(description))
        )) {
            return Errors.badRequest();
        }

        this._title = global.checkEmoji(title);
        this._description = global.checkEmoji(description);
    };
}

module.exports = Note;