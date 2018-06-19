const Errors = require('./Errors');

/**
 * Domain object for a phone number.
 * this domain object is validated with regex.
 */
class PhoneNumber {
    constructor(phoneNumber){
        if(!(
            phoneNumber === "" || phoneNumber && phoneNumber.length < 14 && /^\+?\d{6,13}$/.test(phoneNumber)
        )){
            return Errors.badRequest();
        }
        this._phonenumber = phoneNumber;
    }
}

module.exports = PhoneNumber;