class User {
    constructor(email, password, firstname, lastname){
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
}

module.exports = User