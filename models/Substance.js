const Errors = require('./Errors');
const global = require('../globalFunctions');

/**
 * Domain object for a substance. A substance is something like alcohol, speed, weed, XTC, etc.
 * This domain object is validated with regex.
 * Name is required.
 * measuringUnit is not required.
 *
 * Both name and measuringUnit need to be inserted into the constructor.
 */
class Substance {
    constructor(name, measuringUnit){
        if(!(
            name && /^[^()~+=;:\n*]{0,30}$/.test(name) &&
            (measuringUnit === "" || measuringUnit && /^[A-Za-z\-\d\s]{0,15}$/.test(measuringUnit))
        )) {
            return Errors.badRequest();
        }

        this._name = global.checkEmoji(name);
        this._measuringUnit = global.checkEmoji(measuringUnit);
    }
}

module.exports = Substance;