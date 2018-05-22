class User {
    constructor(email, password, firstname, lastname, phonenumber){
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