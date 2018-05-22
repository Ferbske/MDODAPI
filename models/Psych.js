const User = require('./User')

class Psych {
    constructor(email, password, firstname, lastname, location){
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