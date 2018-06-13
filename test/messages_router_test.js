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
    db.query('DELETE FROM mdod.Client WHERE email = "stijn@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    };
}

describe('Update client and psychologist ', function () {
    this.timeout(10000);
    let psychToken = '';
    let clientToken = '';
    before(function () {
        deletePsychologist();
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

    it('LOGGING IN WITH A PSYCHOLOGIST FOR TESTING', (done) => {
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

    it('INSERT A CLIENT FOR TESTING', (done) => {
        chai.request(index)
            .post('/api/register/client')
            .set('Content-Type', 'application/json')
            .send({
                "firstname": "Stijn",
                "infix": "",
                "lastname": "veen",
                "dob": "1996-11-27",
                "email": "stijn@gmail.com",
                "password": "qwerty123",
                "phonenumber": "062345678",
                "city": "Bergen op Zoom",
                "adress": "Zuidsingel 8",
                "zipcode": "4611 HB"
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

    it('CONNECT A CLIENT TO A PSYCHOLOOG FOR TESTING', (done) => {
        chai.request(index)
            .put('/api/v1/pickclient')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email": "stijn@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(202);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends a valid message and should have a 200 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologist')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com",
                "message" : "Sam goed bezig met je drugs gebruik! je gebruikt nu al 2 kilo coke minder deze week!"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends a valid message with a invalid email and should have a 404 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologist')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "tijn@gmail.com",
                "message" : "Sam goed bezig met je drugs gebruik! je gebruikt nu al 2 kilo coke minder deze week!"
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends a empty message but with a valid email should have a 400 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologist')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com",
                "message" : ""
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends no message and should have a 400 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologist')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com",
                })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends a valid message without an email should return 404', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologist')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "message" : "Sam goed bezig met je drugs gebruik! je gebruikt nu al 2 kilo coke minder deze week!"
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends a valid message with a invalid token and should have a 401 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologist')
            .set('Authorization', 'Bearer ' + 'fout' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com",
                "message" : "Sam goed bezig met je drugs gebruik! je gebruikt nu al 2 kilo coke minder deze week!"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    it('PSYCHOLOGIST: sends a valid message with a invalid route and should have a 400 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/psychologis')
            .set('Authorization', 'Bearer ' + psychToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com",
                "message" : "Sam goed bezig met je drugs gebruik! je gebruikt nu al 2 kilo coke minder deze week!"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a valid message and should have a 200 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/client')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "message" : "Sam goed bezig met je drugs gebruik! je gebruikt nu al 2 kilo coke minder deze week!"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a valid message and should have a 200 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/client')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "message" : "Mr. de psycholoog hou eens op met berichten sturen."
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends an empty message and should have a 400 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/client')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "message" : ""
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends no message and should have a 400 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/client')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({

            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a valid message with a invalid token and should have a 401 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/client')
            .set('Authorization', 'Bearer ' + 'fout' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "message" : "Mr. de psycholoog hou eens op met berichten sturen."
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a valid message with an invalid route and should have a 400 status', (done) => {
        chai.request(index)
            .post('/api/v1/messages/clien')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "message" : "Mr. de psycholoog hou eens op met berichten sturen."
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