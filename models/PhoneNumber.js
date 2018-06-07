const Errors = require('./Errors');

class PhoneNumber {
    constructor(phonenumber){
        if(!(
            phonenumber === "" || phonenumber && phonenumber.length < 14 && /^\+?\d{6,13}$/.test(phonenumber)
        )){
            return Errors.badRequest();
        }
        this._phonenumber = phonenumber;
    }
}

module.exports = PhoneNumber;