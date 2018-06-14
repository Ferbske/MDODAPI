const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

let psychToken;
let clientToken;

const singleClient = {
    email: "chai@test.client"
};

const nonExistingClient = {
    email: "wrong@client.com"
};

const testNote = {
    email: singleClient.email,
    description: 'Chai test voor note'
};

function deleteTestNote() {
    db.query("DELETE FROM mdod.Note WHERE email = ?", ['chai@test.client'], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.affectedRows < 1) {
            console.log("0 rows affected.");
        }
    })
}

describe('Note', () => {
    before((done) => {
        chai.request(index)
            .post('/api/login/client')
            .send({
                email: 'chai@test.client',
                password: 'qwerty123'
            })
            .end((err, res) => {
                clientToken = res.body.token;
            });

        chai.request(index)
            .post('/api/login/psychologist')
            .send({
                email: 'chai@test.psych',
                password: 'qwerty123'
            })
            .end((err, res) => {
                psychToken = res.body.token;

                done();
            });
    });

    it('should return a unAuthorized error when token is not valid', (done) => {
        chai.request(index)
            .get('/api/v1/note/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'ABC')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                }

                res.should.have.status(401);
                done();
            })
    });

    it('should return a not found error when email doesn\'t exists', (done) => {
        chai.request(index)
            .post('/api/v1/note/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(nonExistingClient)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("timestamp");
                done();
            })
    });

    it('should create a note for a single client', (done) => {
        chai.request(index)
            .post('/api/v1/note')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(testNote)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            })
    });

    it('should return an array with notes for a single client', (done) => {
        chai.request(index)
            .post('/api/v1/note/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(singleClient)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property('id');
                res.body[0].should.have.property('email');
                res.body[0].should.have.property('description');
                done();
            })
    });

    it('should return a not found error when email doesn\'t exists', (done) => {
        chai.request(index)
            .post('/api/v1/note/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(nonExistingClient)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("timestamp");
                done();
            })
    });

    it('should return a bad request when url is not valid', (done) => {
        chai.request(index)
            .post('/api/v1/notes/single_clients')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(nonExistingClient)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('code');
                res.body.should.have.property('timestamp');
                done();
            })
    });

    after((done) => {
        deleteTestNote();
        done();
    })
});