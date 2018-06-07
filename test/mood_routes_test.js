const chai = require('chai');
const chaiHttp = require('chai-http');
const index = require('../index');
const db = require('../db/databaseConnector');

chai.should();
chai.use(chaiHttp);

let token;
let goalId;
const testGoal = {
    "description": "Chai test voor Moods!"
};

function testClient(){
    let firstname =  "sjaak";
    let infix = "";
    let lastname = "Neus";
    let dob = "1996-11-27";
    let email = "sjaak@gmail.com";
    let password = "qwerty123";
    let phonenumber = "062345678";
    let city = "Breda";
    let address = "Zuidsingel 8";
    let zipCode = "6969 HB";

    db.query('DELETE FROM mdod.Client WHERE email = "sjaak@gmail.com"'), function (err) {
        if (err) {
            console.log(err);
        }
    }

    db.query("INSERT INTO mdod.Client VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
    [email, null, password, phonenumber, dob, city, address, zipCode, firstname, infix, lastname], (err) => {
        if(err){
            console.log(err);
        }
    });
}

describe('Mood', function() {
    this.timeout(10000);

    before(function () {
        testClient();
    });

    if (!token) {
        before(() => {
            chai.request(index)
                .post('/api/login/client')
                .set('Content-Type', 'application/json')
                .send({
                    email: "sjaak@gmail.com",
                    password: "qwerty123"
                })
                .end((err, res) => {
                    if (err) {
                        console.log("Mood Error ==== " + err);
                    }
                    token = res.body.token;
                    console.log("RES ===== " + res.body.token);
                    console.log(token);
                });
        });
    }

    it('POST Mood', (done) => {
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
                    console.log("POST MOOD ERROR ==== " + err);
                }
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message', 'Mood aangemaakt');
                done();
            })
    });


    it('GET MOOD', (done) => {
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