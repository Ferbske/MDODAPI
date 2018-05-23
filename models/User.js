const Errors = require('./Errors');

class User {
    constructor(email, password, firstname, lastname, phonenumber){
        if (!(
            email && /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]/.test(email) &&
            password && /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,80}$/.test(password) &&
            firstname && /^[A-Za-z]{2,50}$/.test(firstname) &&
            lastname && /^[A-Za-z]{2,50}$/.test(lastname) &&
            phonenumber
        )) {
            return new Errors.badRequest();
        }
        
        this.email = email
        this.password = password
        this.firstname = firstname
        this.lastname = lastname
    }

    get email(){
        return this.email
    }

    set email(email){
        this.email = email
    }

    get password(){
        return this.password
    }

    set password(password){
        this.password = password
    }

    get firstname(){
        return this.firstname
    }

    set firstname(firstname){
        this.firstname = firstname
    }

    get lastname(){
        return this.lastname
    }

    set lastname(lastname){
        this.lastname = lastname
    }

    get phonenumber(){
        return this.phonenumber
    }

    set phonenumber(phonenumber){
        this.phonenumber = phonenumber
    }
}

module.exports = User