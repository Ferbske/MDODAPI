const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

let token;

const testSubstance = {
    name: 'Chai',
    measuringUnit: ""
};

function deleteTestSubstance() {
    db.query("DELETE FROM mdod.Substance WHERE name = ? AND measuringUnit = ?;", [testSubstance.name, testSubstance.measuringUnit], (error, result) => {
        if (error) {
            console.log(error);
        }

        if (result.affectedRows < 1) {
            console.log("Affected rows is 0");
        }
    })
}

describe('Substance', () => {

    before((done) => {
        chai.request(index)
            .post('/api/login/psychologist')
            .send({
                email: "chai@test.psych",
                password: 'qwerty123'
            })
            .end((err, res) => {
                token = res.body.token;
                console.log(token);
                done();
            });
    });

    it('should return all substances that exists when valid token is given', (done) => {
        chai.request(index)
            .get('/api/v1/substance/all')
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body[0].should.have.property("id");
                res.body[0].should.have.property("name");
                res.body[0].should.have.property("measuringUnit");
                done();
            });
    });

    it('should return notAuthorized error when no valid token is given', (done) => {
        chai.request(index)
            .get('/api/v1/substance/all')
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer e" + token)
            .end((err, res) => {
                res.should.have.status(401);
                res.body.should.be.a('object');
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("timestamp");
                done();
            });
    });

    it('should return a bad request when url is not valid', (done) => {
        chai.request(index)
            .get('/api/v1/substance/alll')
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + token)
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property("message");
                res.body.should.have.property("code");
                res.body.should.have.property("timestamp");
                done();
            });
    });

    it('should return status 201 when substance is successfully inserted', (done) => {
        chai.request(index)
            .post('/api/v1/substance')
            .set('Content-Type', 'application/json')
            .set("Authorization", "Bearer " + token)
            .send(testSubstance)
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                done();
            })

    });

    after((done)=> {
        deleteTestSubstance();
        done();
    });
});



