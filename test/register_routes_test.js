const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');

chai.should();
chai.use(chaiHttp);

// After successful registration we have a valid token. We export this token
// for usage in other testcases that require login.

describe('Registration', function () {
    this.timeout(10000);
    it('PSYCHOLOGIST: should return a 200 status when providing valid information', (done) => {
        chai.request(index)
            .post('/api/register/psychologist')
            .set('Content-Type', 'application/json')
            .send({
                "firstname" : "Henk",
                "infix" : "van den",
                "lastname" : "Heuvel",
                "phonenumber": "062345678",
                "location" : "Breda",
                "email" : "henk@gmail.com",
                "password" : "qwerty123"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            })
    });

    it('CLIENT: should return a 200 status when providing valid information', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "sjaak",
                "infix": "",
                "lastname": "Neus",
                "dateofbirth": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city" : "Breda",
                "adress" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            })
    });
});