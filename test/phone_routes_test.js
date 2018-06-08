const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

function deleteClient() {
    db.query('DELETE FROM mdod.Client WHERE email = "stijn@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    };
}

describe('CRUD for phonenumbers', function () {
    this.timeout(10000);
    let clientToken = '';

    before(function () {
        deleteClient();
    });

    it('INSERT A PSYCHOLOGIST FOR TESTING', (done) => {
        chai.request(index)
            .post('/api/register/psychologist')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "stijn",
                "infix": "van",
                "lastname": "Veen",
                "phonenumber": "0629456850",
                "location": "Bergen op Zoom",
                "email": "stijn@gmail.com",
                "password": "qwerty123"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });

    it('LOGIN A CLIENT FOR TESTING', (done) => {
        chai.request(index)
            .post('/api/login/client')
            .set('Content-Type', 'application/json')
            .send({
                "email": "stijn@gmail.com",
                "password": "qwerty123"
            })
            .end((err, res) => {
                let result = JSON.parse(res.text);
                clientToken = result.token;
                done();
            });
    });

    it('CLIENT: insert some phonenumbers', (done) =>{
       chai.request(index)
           .put('/api/v1/phone')
           .set('Authorization', 'Bearer ' + clientToken)
           .send({
               "email" : "yannick@gmail.com",
               "firm": "0611234567"

           })
    });
});