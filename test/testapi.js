var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server_project');

var should = chai.should();

chai.use(chaiHttp);


describe('pruebas colombia', () => {
    it('mi api funciona con get', (done) => {
        chai.request('http://localhost:3000')
            .get('/apitechu/v0/accounts')
            .end((err, res) => {
                console.log(res.body[0]);
                res.body[0].should.have.property('id_account');
                res.body[0].should.have.property('iban');
                done()
            })
    })

    it('mi api funciona con post', (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "iban": "IS03 0893 4358 9317 5499 0439 68" })
            .end((err, res, body) => {
                console.log(body);
                res.body;
                done()
            })
    })
})