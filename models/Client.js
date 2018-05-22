const User = require('./User')

class Client extends User {
    constructor(email, password, firstname, lastname, phonenumber, dob, city, address, postal){
        super(email, password, firstname, lastname, phonenumber)
        this.dob = dob
        this.city = city
        this.address = address
        this.postal = postal
        this.psych = null
    }

    constructor(email, password, firstname, lastname, phonenumber, dob, city, address, postal, psych){
        super(email, password, firstname, lastname, phonenumber)
        this.dob = dob
        this.city = city
        this.address = address
        this.postal = postal
        this.psych = psych
    }

    get dob(){
        return this.dob
    }

    set dob(dob){
        this.dob = dob
    }

    get city(){
        return this.city
    }

    set city(city){
        this.city = city
    }

    get address(){
        return this.address
    }

    set address(address){
        this.address = address
    }

    get postal(){
        return this.postal
    }

    set postal(postal){
        this.postal = postal
    }

    get psych(){
        return this.psych
    }

    set psych(psych){
        this.psych = psych
    }
}

module.exports = Client