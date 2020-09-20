var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server_project');

var should = chai.should();

chai.use(chaiHttp);


describe('Movimientos', () => {
    it('Agregando cuenta 1 ', (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "iban": "IS03 0893 4358 9317 5499 0439 68" })
            .end((err, res, body) => {
                console.log(body);
                res.body;
                done()
            })
    })
    
    it('Agregando cuenta 2 ', (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "iban": "IS03 0893 4358 9317 5499 0439 69" })
            .end((err, res, body) => {
                console.log(body);
                res.body;
                done()
            })
    })

    it('Verificando las cuentas', (done) => {
        chai.request('http://localhost:3000')
            .get('/apitechu/v0/accounts')
            .end((err, res) => {
                console.log(res.body[0]);
                res.body[0].should.have.property('id_account');
                res.body[0].should.have.property('iban');
                done()
            })
    })    

    it('Agregando un movimiento cuando ambas cuentas existan', (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/movements')
            .send({
                "from_iban": "IS03 0893 4358 9317 5499 0439 68",
                "to_iban": "IS03 0893 4358 9317 5499 0439 69",
                "amount": 100
            })
            .end((err, res, body) => {
                res.status.should.equal(201);
                done()
            })
    })
    
    it('Eliminando cuenta 1 ', (done) => {
        chai.request('http://localhost:3000')
            .delete('/apitechu/v0/accounts/1')
            .end((err, res, body) => {
                console.log(body);
                res.body;
                done()
            })
    })
    
    it('Elimando cuenta 2 ', (done) => {
        chai.request('http://localhost:3000')
            .delete('/apitechu/v0/accounts/2')
            .end((err, res, body) => {
                console.log(body);
                res.body;
                done()
            })
    })
})