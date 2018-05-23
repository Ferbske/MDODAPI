const User = require('./User')

class Client extends User {
    constructor(email, password, firstname, lastname, phonenumber, dob, city, address, zipCode){
        if (!(
            dob &&
            city && /^[A-Za-z]{2,25}/.test(city) &&
            address && /^([A-Za-z'\-]+\s)*\d+([A-Z-a-z]*)/.test(address)
        )){}

        super(email, password, firstname, lastname, phonenumber)
        this.dob = dob
        this.city = city
        this.address = address
        this.zipCode = zipCode
        this.psych = null
    }

    constructor(email, password, firstname, lastname, phonenumber, dob, city, address, zipCode, psych){
        super(email, password, firstname, lastname, phonenumber)
        this.dob = dob
        this.city = city
        this.address = address
        this.zipCode = zipCode
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

    get zipCode(){
        return this.zipCode
    }

    set zipCode(zipCode){
        this.zipCode = zipCode
    }

    get psych(){
        return this.psych
    }

    set psych(psych){
        this.psych = psych
    }
}

module.exports = Client