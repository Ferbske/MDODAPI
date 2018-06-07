const Errors = require('./Errors');

class Substance {
    constructor(name, measuringUnit){
        if(!(
            name && /^.{0,30}/.test(name) &&
            (measuringUnit === "" || measuringUnit && /^[A-Za-z\-\d\s]{0,15}/.test(measuringUnit))
        )) {
            return Errors.badRequest();
        }

        this._type = type;
        this._name = name;
        this._measuringUnit = measuringUnit;
    }
}

module.exports = Substance;