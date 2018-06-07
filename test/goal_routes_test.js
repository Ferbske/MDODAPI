const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

let token;
let goalId;
const testGoal = {
    "description": "Chai test voor Goals!"
};

describe('Goal', () => {
    if (!token) {
        before(() => {
            chai.request(index)
                .post('/api/login/client')
                .set('Content-Type', 'application/json')
                .send({
                    email: "niek@gmail.nl",
                    password: "qwerty123"
                })
                .end((err, res) => {
                    if (err) {
                        console.log("Goal Error ==== " + err);
                    }
                    token = res.body.token;
                    console.log("RES ===== " + res.body.token);
                    console.log(token);
                });
        });
    }

    it('POST GOAL', (done) => {
        chai.request(index)
            .post('/api/v1/goal')
            .set('Content-Type', 'application/json')
            // .set('X-Access-Token', '' + token)
            // .set('Authorization', 'Bearer ' + token)
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .send(testGoal)
            .end((err, res) => {
                if (err) {
                    console.log("POST GOAL ERROR ==== " + err);
                }
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message', 'Goal aangemaakt');
                done();
            })
    });


    it('GET GOAL', (done) => {
        chai.request(index)
            .get('/api/v1/goal')
            .set('Content-Type', 'application/json')
            // .set('X-Access-Token', '' + token)
            // .set('Authorization', 'Bearer ' + token)
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');
                goalId = res.body[res.body.length-1].goalId;
                done();
            });
    });

    it('UPDATE GOAL', (done) => {
        chai.request(index)
            .put('/api/v1/goal/' + goalId)
            .set('Content-Type', 'application/json')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .send({
                "description": "Update Chai Test."
            })
            .end((err, res) => {
                res.should.have.status(202);
                res.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message', 'Goal geüpdated.');
                done();
            });
    });

    it('DELETE GOAL', (done) => {
        chai.request(index)
            .delete('/api/v1/goal/' + goalId)
            .set('Content-Type', 'application/json')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message', 'Goal verwijderd.');
                done();
            })
    });

    it('should return an error if token is not valid', (done) => {
        chai.request(index)
            .get('/api/v1/goal')
            .set('Content-Type', 'application/json')
            .set('X-Access-Token', 'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDMwNDcsInN1YiI6Im5pZWtAZ21haWwubmwiLCJpYXQiOjE1Mjc2NzkwNDd9.xy3wpSCTkN-48AZMEjuoxnfP1fKpkodwLdbEVND-2C4oht7fHfzrFQU3iuhS1mrL4KR6L9HNt9JG3yhxhNVKRw')
            .end((err, res) => {
                res.should.have.status(498);
                done();
            })
    });

});