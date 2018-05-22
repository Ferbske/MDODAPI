const User = require('./User')

class Client extends User {
    constructor(email, password, firstname, lastname, dob){
        super(email, password, firstname, lastname)
        this.dob = dob
    }

    constructor(email, password, firstname, lastname, dob, psych){
        super(email, password, firstname, lastname)
        this.dob = dob
        this.psych = psych
    }

    get dob(){
        return this.dob
    }

    set dob(dob){
        this.dob = dob
    }

    get psych(){
        return this.psych
    }

    set psych(psych){
        this.psych = psych
    }
}