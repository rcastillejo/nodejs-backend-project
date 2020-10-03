var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = chai.should();

chai.use(chaiHttp);

describe('Agregando un nueva cuenta y eliminandola', () => {

    let alias = "DEMO";
    let account;
    it(`Agregando cuenta ${alias}`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "alias": alias })
            .end((err, res, body) => {

                res.status.should.equal(201);

                res.body.should.have.property('account');
                res.body.should.have.property('alias');

                res.body.alias.should.equal(alias);

                account = res.body.account;

                done()
            })
    })

    it(`Consultando cuenta ${account}`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/accounts/${account}`)
            .end((err, res, body) => {
                res.status.should.equal(200);

                res.body.should.have.property('account');
                res.body.should.have.property('alias');

                res.body.account.should.equal(account);
                res.body.alias.should.equal(alias);

                done()
            })
    })

    it(`Consultando cuentas`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/accounts?alias=${alias}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].should.have.property('account');
                res.body[0].should.have.property('alias');

                res.body[0].account.should.equal(account);
                res.body[0].alias.should.equal(alias);

                done()
            })
    })

    it(`Eliminando cuenta ${account}`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/accounts/${account}`)
            .end((err, res, body) => {

                res.status.should.equal(200);

                res.body.should.have.property('account');
                res.body.should.have.property('alias');

                res.body.account.should.equal(account);
                res.body.alias.should.equal(alias);

                done()
            })
    })

})

describe('Transfiero entre cuentas', () => {
    let alias1 = "DEMO1";
    let alias2 = "DEMO2";
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


    it(`Transfiriendo de cuenta2 a cuenta1`, (done) => {
        chai.request('http://localhost:3000')
            .post(`/apitechu/v0/accounts/${account2}/movements`)
            .send({ "to": account1, "amount": 1.00 })
            .end((err, res, body) => {
                res.status.should.equal(201);
                done()
            })
    })

    it(`Consultando cuenta1`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/accounts/${account1}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.should.have.property('balance');
                res.body.balance.should.equal(1.00);
                done()
            })
    })

    it(`Consultando cuenta2`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/accounts/${account2}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.should.have.property('balance');
                res.body.balance.should.equal(0);
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

describe('Agregando un nueva cuenta ya existente', () => {

    let alias = "DEMO";
    let account;
    it(`Agregando cuenta ${alias}`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "alias": alias })
            .end((err, res, body) => {

                res.status.should.equal(201);

                res.body.should.have.property('account');
                res.body.should.have.property('alias');

                res.body.alias.should.equal(alias);

                account = res.body.account;

                done()
            })
    })

    it(`Agregando cuenta ${alias} ya existente`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .send({ "alias": alias })
            .end((err, res, body) => {

                res.status.should.equal(400);

                res.body.msg.should.equal("Cuenta ya existe");

                done()
            })
    })

    it(`Eliminando cuenta`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/accounts/${account}`)
            .end((err, res, body) => {

                res.status.should.equal(200);

                done()
            })
    })

})
