const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

function deletePsychologist() {
    db.query('DELETE FROM mdod.Psychologist WHERE email = "stijn@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    };
}

function deleteClient() {
    db.query('DELETE FROM mdod.Client WHERE email = "sjaak@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    };
}

describe('Update client and psychologist ', function () {
    this.timeout(10000);
    let clientToken = '';
    let psychToken = '';

    before(function () {
        deletePsychologist();
        deleteClient();


    });

    console.log(clientToken);

    it('TEST1', (done) => {
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
    it('TEST2', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "sjaak",
                "infix": "",
                "lastname": "Neus",
                "dob": "1996-11-27",
                "email": "sjaak@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city": "Breda",
                "adress": "Zuidsingel 8",
                "zipcode": "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });
    it('TEST3', (done) => {
        chai.request(index)
            .post('/api/login/client')
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com",
                "password": "qwerty123"
            })
            .end((err, res) => {
                let result = JSON.parse(res.text);
                clientToken = result.token;
                done();
            });
    });
    it('TEST4', (done) => {
        chai.request(index)
            .post('/api/login/psychologist')
            .set('Content-Type', 'application/json')
            .send({
                "email": "stijn@gmail.com",
                "password": "qwerty123"
            })
            .end((err, res) => {
                psychToken = res.body.token;
                done();
            });
    });


    it('PSYCHOLOOG: should return an array of clients', (done) => {
        chai.request(index)
            .get('/api/v1/all/client')
            .set('Authorization', 'Bearer ' + psychToken)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });


    it('PSYCHOLOOG: should return a client for a psychologist', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });


    it('PSYCHOLOOG: should return a not found error for having an invalid email', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "jaak@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOOG: should return a not found error when no email is provided in the body', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
               "email": ""
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOOG: should return a bad request error for having a bad route', (done) => {
        chai.request(index)
            .post('/api/v1/specific/cliend')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOOG: should return a 200 status and has added a psycholoog to a client', (done) => {
        chai.request(index)
            .put('/api/v1/pickclient')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(202);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOOG: should return a 404 status when given a invalid client', (done) => {
        chai.request(index)
            .put('/api/v1/pickclient')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "jaak@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOOG: should return a 498 status for an invalid token when given a valid client', (done) => {
        chai.request(index)
            .put('/api/v1/pickclient')
            .set('Authorization', 'Bearer ' + psychToken + 'foute token')
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com",
            })
            .end((err, res) => {
                res.should.not.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOOG: should return a 400 status for an invalid route when given a valid client', (done) => {
        chai.request(index)
            .put('/api/v1/pickcliend')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });


    after(function () {
        deletePsychologist();
        deleteClient();
        //process.exit(0);
    });
});