
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
    }
}

function deleteClient() {
    db.query('DELETE FROM mdod.Client WHERE email = "stijn@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    }
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

    it('CLIENT: sends a mood with valid input, should return 201', (done) => {
        chai.request(index)
            .post('/api/v1/mood')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "value" : 2,
                "description" : "bier"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a mood with empty values should return 400', (done) => {
        chai.request(index)
            .post('/api/v1/mood')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "value" : "",
                "description" : ""
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a mood with empty description, but valid value should return 400', (done) => {
        chai.request(index)
            .post('/api/v1/mood')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "value" : 1,
                "description" : ""
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: invalid ', (done) => {
        chai.request(index)
            .post('/api/v1/mood')
            .set('Authorization', 'Bearer ' + "fout" + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "value" : 2,
                "description" : "bier"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: sends a mood with valid input, should return 201', (done) => {
        chai.request(index)
            .post('/api/v1/moo')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "value" : 2,
                "description" : "bier"
            })
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get moods as client', (done) => {
        chai.request(index)
            .get('/api/v1/mood')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('CLIENT: get moods as client with invalid token', (done) => {
        chai.request(index)
            .get('/api/v1/mood')
            .set('Authorization', 'Bearer ' + "fout" + clientToken)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get moods as client with invalid route', (done) => {
        chai.request(index)
            .get('/api/v1/moo')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get days clean', (done) => {
        chai.request(index)
            .get('/api/v1/mood/status')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get days clean with invalid token', (done) => {
        chai.request(index)
            .get('/api/v1/mood/status')
            .set('Authorization', 'Bearer ' + "fout" + clientToken)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get days clean', (done) => {
        chai.request(index)
            .get('/api/v1/mood/statu')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get moods from a client, should return 201', (done) => {
        chai.request(index)
            .post('/api/v1/mood/client')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com"
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('CLIENT: get moods from client, with a invalid token, should return 401', (done) => {
        chai.request(index)
            .post('/api/v1/mood/client')
            .set('Authorization', 'Bearer ' + "fout" + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com"
            })
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get moods, with invalid email, should return 404', (done) => {
        chai.request(index)
            .post('/api/v1/mood/client')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "tijn@gmail.com"
            })
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: get moods, with invalid route, should return 400', (done) => {
        chai.request(index)
            .post('/api/v1/mood/clien')
            .set('Authorization', 'Bearer ' + clientToken)
            .set('Content-Type', 'application/json')
            .send({
                "email" : "stijn@gmail.com"
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
        //process.exit();
    });
});