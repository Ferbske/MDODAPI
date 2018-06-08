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

function deleteClient() {
    db.query('DELETE FROM mdod.Client WHERE email = "sjaak@gmail.com"'),
        function (err) {
            if (err) {
                console.log(err);
            }
        };
}

function createClient() {
    let firstname = "sjaak";
    let infix = "";
    let lastname = "Neus";
    let dob = "1996-11-27";
    let email = "sjaak@gmail.com";
    let password = "qwerty123";
    let phonenumber = "062345678";
    let city = "Breda";
    let address = "Zuidsingel 8";
    let zipCode = "6969 HB";

    db.query("INSERT INTO mdod.Client VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [email, null, password, phonenumber, dob, city, address, zipCode, firstname, infix, lastname], (err) => {
        if (err) {
            console.log(err);
        }
    });
}

describe('Mood', function () {
    this.timeout(10000);

    before(function () {
        deleteClient();
        createClient();

        //Get JWT token
        if (!token) {
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
        };
    });

    it('POST Mood', (done) => {
        chai.request(index)
            .post('/api/v1/goal')
            .set('Content-Type', 'application/json')
            .set('Authorization', token)
            .end((err, res) => {
                res.should.have.status(498);
                done();
            })
    });

});