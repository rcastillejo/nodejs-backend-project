var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = chai.should();

chai.use(chaiHttp);


describe('Movimientos', () => {
    
    let alias1 = "DEMO11";
    let alias2 = "DEMO12";
    let account1;
    let account2;

    it(`Agregando cuenta1`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "alias": alias1, "balance": 1.00 })
            .end((err, res, body) => {

                res.status.should.equal(201);

                res.body.should.have.property('account');
                res.body.should.have.property('alias');

                res.body.alias.should.equal(alias1);

                account1 = res.body.account;

                done()
            })
    })

    it(`Agregando cuenta2`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "alias": alias2 })
            .end((err, res, body) => {

                res.status.should.equal(201);

                res.body.should.have.property('account');
                res.body.should.have.property('alias');

                res.body.alias.should.equal(alias2);

                account2 = res.body.account;

                done()
            })
    })


    it(`Transfiriendo de cuenta1 a cuenta2`, (done) => {
        chai.request('http://localhost:3000')
            .post(`/apitechu/v0/accounts/${account1}/movements`)
            .send({ "to": account2, "amount": 1.00 })
            .end((err, res, body) => {
                res.status.should.equal(201);
                done()
            })
    })
    

    it(`Consultando movimientos de todas las cuentas`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/movements`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(2);

                res.body[0].should.have.property('alias');
                res.body[0].should.have.property('amount');
                res.body[0].should.have.property('date');

                res.body[0].alias.should.equal(account1);
                res.body[0].amount.should.equal(-1.00);

                res.body[1].should.have.property('alias');
                res.body[1].should.have.property('amount');
                res.body[1].should.have.property('date');

                res.body[1].alias.should.equal(account2);
                res.body[1].amount.should.equal(1.00);

                done()
            })
    })

    it(`Eliminando cuenta1`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/accounts/${account1}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                done()
            })
    })

    it(`Eliminando cuenta2`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/accounts/${account2}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                done()
            })
    })
    
})