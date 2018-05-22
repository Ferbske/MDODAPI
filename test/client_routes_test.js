const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

chai.should()
chai.use(chaiHttp)

describe('Client Authentication', function(){
    this.timeout(10000)

    it('Logs in as client', function(done){
        chai.request(server)
        .post('/login')
        .send({
            "email":"test@roorda.nl",
            "password":"secret123"
        })
        .end((err, res) => {
            res.should.be.a('object')
        })
        done()
    })
})