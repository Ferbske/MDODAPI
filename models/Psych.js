const User = require('./User')
const Errors = require('./Errors');

class Psych extends User{
    constructor(email, password, firstname, lastname, location){
        if(!(
            location && /^[A-Za-z]{2,25}/.test(location)
        )) {
            return new Errors.badRequest();
        }

        super(email, password, firstname, lastname)
        this.location = location
        this.clients = []
    }

    constructor(email, password, firstname, lastname, location, clients){
        super(email, password, firstname, lastname)
        this.location = location
        this.clients = clients
    }

    get location(){
        return this.location
    }

    set location(location){
        this.location = location
    }

    get clients(){
        return this.clients
    }

    set clients(clients){
        this.clients = clients
    }
}

module.exports = Psych