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

    before(function () {
        deletePsychologist();
        deleteClient();

    });

    it('PSYCHOLOGIST: INSERT A PSYCHOLOGIST FOR TESTING', (done) => {
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

    it('CLIENT: INSERT CLIENT FOR TESTING', (done) => {
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
                "city" : "Breda",
                "adress" : "Zuidsingel 8",
                "zipcode" : "6969 HB"
            })
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: should return an array of clients', (done) => {
        chai.request(index)
            .get('/api/v1/all/client')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });

    it('CLIENT: should return an invalid token error', (done) => {
        chai.request(index)
            .get('/api/v1/all/client')
            .set('X-Access-Token', 'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .end((err, res) => {
                res.should.have.status(498);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: should return a client for a psychologist', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
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

    it('CLIENT: should return an invalid token error', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('X-Access-Token', 'yJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Content-Type', 'application/json')
            .send({
                "email": "sjaak@gmail.com",
            })
            .end((err, res) => {
                res.should.have.status(498);
                res.body.should.be.a('object');
                done();
            });
    });

    it('CLIENT: should return a not found error for having an invalid email', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
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

    it('CLIENT: should return a not found error when nothing is in the body', (done) => {
        chai.request(index)
            .post('/api/v1/specific/client')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
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

    it('CLIENT: should return a bad request error for having a bad route', (done) => {
        chai.request(index)
            .post('/api/v1/specific/cliend')
            .set('X-Access-Token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
            .set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjE1Mjg1NDg4MTQsInN1YiI6InN0aWpuQGdtYWlsLmNvbSIsImlhdCI6MTUyNzY4NDgxNH0.wU8VCIlRLPZjkybrbgXA88YXzcmunxA3xpBrlvk5ELzIDk-Y8n67PzohaZJjXFHvyEQ8-v2cqrxq7-0m5t7JEQ')
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


    after(function () {
        deletePsychologist();
        deleteClient();
        //process.exit(0);
    });
});