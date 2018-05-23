const Errors = require('./Errors');

class Psychologist{
    constructor(email, password, firstname, infix, lastname, location, phonenumber){
        if (!(
            email && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]/.test(email) &&
            password && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,80}$/.test(password) &&
            firstname && /^[A-Za-z]{2,50}$/.test(firstname) &&
            (infix === "" || infix && /^[A-Za-z]{2,8}(\s[A-Z-a-z]{2,8})*/.test(infix)) &&
            lastname && /^[A-Za-z]{2,50}$/.test(lastname) &&
            phonenumber &&
            location && /^[A-Za-z]{2,25}/.test(location)
        )) {
            console.log("Before Errors.badRequest");
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