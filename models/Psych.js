const Errors = require('./Errors');

class Psychologist {
    constructor(email, password, firstname, infix, lastname, location, phonenumber) {
        if (!(
            email && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z-.]{2,20}/.test(email) &&
            password && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,80}$/.test(password) &&
            firstname && /^([^\d!@#$%^&*()=+~<>]){2,50}$/.test(firstname) &&
            (infix === "" || infix && /^([^\d!@#$%^&*()=+~<>]){2,8}(\s[^\d!@#$%^&*()=+~<>]{2,8})*/.test(infix)) &&
            lastname && /^([^\d!@#$%^&*()=+~<>]){2,50}$/.test(lastname) &&
            (phonenumber === "" || phonenumber && phonenumber.length < 14 && /^\+?\d{6,13}/.test(phonenumber)) &&
            (location === "" || location && /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/.test(location))
        )) {
            return Errors.badRequest();
        }

        this._email = email;
        this._password = password;
        this._firstname = firstname;
        this._lastname = lastname;
        this._phonenumber = phonenumber;
        this._location = location;
        this._clients = []
    }
}

module.exports = Psychologist;