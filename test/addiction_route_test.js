const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

let psychToken;
let clientToken;

const testAddiction = {
    substanceId: 3,
    email: "chai@test.client"
};

const singleClient = {
    email: "chai@test.client"
};

const nonExistingClient = {
    email: "wrong@client.com"
};

function deleteTestAddiction() {
    db.query("DELETE FROM mdod.Addiction WHERE email = ?", [testAddiction.email], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.affectedRows < 1) {
            console.log("0 rows affected.");
        }
    })
}

describe("Addiction", () => {
    before((done) => {
        chai.request(index)
            .post('/api/login/psychologist')
            .send({
                email: "chai@test.psych",
                password: 'qwerty123'
            })
            .end((err, res) => {
                psychToken = res.body.token;
            });

        chai.request(index)
            .post('/api/login/client')
            .send({
                email: "chai@test.client",
                password: "qwerty123"
            })
            .end((err, res) => {
                clientToken = res.body.token;
                done();
            })
    });

    it('should return a not found error when email doesn\'t exists', (done) => {
        chai.request(index)
            .post('/api/v1/addiction/single_client')
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

    it('should create an addiction if the client email exists', (done) => {
        chai.request(index)
            .post('/api/v1/addiction')
            .set('Conent-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(testAddiction)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property("message");
                done();
            })
    });

    it('should return an array of addiction for a single client', (done) => {
        chai.request(index)
            .post('/api/v1/addiction/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + psychToken)
            .send(singleClient)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property("id");
                res.body[0].should.have.property("substanceId");
                res.body[0].should.have.property("email");
                res.body[0].should.have.property("name");
                res.body[0].should.have.property("measuringUnit");
                done();
            })
    });

    it('should return a not found error when client tries to get all the addictions', (done) => {
        chai.request(index)
            .post('/api/v1/addiction/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'Bearer ' + clientToken)
            .send(nonExistingClient)
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                done();
            })
    });

    it('should return unAuthorized error when token is invalid', (done) => {
        chai.request(index)
            .post('/api/v1/addiction/single_client')
            .set('Content-Type', 'application/json')
            .set('Authorization', 'ABC')
            .send(nonExistingClient)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                done();
            })
    });

    it('should return a bad request when url is not valid', (done) => {
        chai.request(index)
            .post('/api/v1/single_clients')
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
        deleteTestAddiction();
        done();
    })
});