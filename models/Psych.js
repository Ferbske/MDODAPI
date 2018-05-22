const User = require('./User')

class Psych {
    constructor(email, password, firstname, lastname){
        super(email, password, firstname, lastname)
        this.clients = []
    }

    constructor(email, password, firstname, lastname, clients){
        super(email, password, firstname, lastname)
        this.clients = clients
    }

    get clients(){
        return this.clients
    }

    set clients(clients){
        this.clients = clients
    }
}