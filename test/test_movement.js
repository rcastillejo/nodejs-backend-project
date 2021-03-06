var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var mocks = require('./mocks');

var should = chai.should();

chai.use(chaiHttp);

let user = mocks.user;
let userId;
let token;


describe('Movimientos', () => {

    let alias1 = mocks.alias1;
    let alias2 = mocks.alias2;
    let account1;
    let account2;


    it(`Creando usuario`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/users')
            .send(user)
            .end((err, res, body) => {

                res.status.should.equal(201);

                userId = res.body.id;

                done()
            })
    })

    it(`Iniciando sesion`, (done) => {
        chai.request('http://localhost:3000')
            .post(`/apitechu/v0/login`)
            .send(user)
            .end((err, res, body) => {
                res.status.should.equal(200);

                res.body.should.have.property('token');

                token = res.body.token;

                done()
            })
    })

    it(`Agregando cuenta1`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/accounts')
            .set({ "Authorization": `Bearer ${token}` })
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
            .set({ "Authorization": `Bearer ${token}` })
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
            .set({ "Authorization": `Bearer ${token}` })
            .send({ "to": account2, "amount": 1.00 })
            .end((err, res, body) => {
                res.status.should.equal(201);
                done()
            })
    })

    it(`Consultando movimientos de todas las cuentas`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/movements`)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(2);

                res.body[0].should.have.property('alias');
                res.body[0].should.have.property('amount');
                res.body[0].should.have.property('date');

                res.body[0].alias.should.equal(alias1);
                res.body[0].amount.should.equal(-1.00);

                res.body[1].should.have.property('alias');
                res.body[1].should.have.property('amount');
                res.body[1].should.have.property('date');

                res.body[1].alias.should.equal(alias2);
                res.body[1].amount.should.equal(1.00);

                done()
            })
    })

    it(`Eliminando cuenta1`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/accounts/${account1}`)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res, body) => {
                res.status.should.equal(200);
                done()
            })
    })

    it(`Eliminando cuenta2`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/accounts/${account2}`)
            .set({ "Authorization": `Bearer ${token}` })
            .end((err, res, body) => {
                res.status.should.equal(200);
                done()
            })
    })

    it(`Cerrando sesion`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/logout')
            .send(user)
            .end((err, res, body) => {

                res.status.should.equal(200);

                res.body.should.have.property('msg');

                res.body.msg.should.equal("LogOut correcto");

                done()
            })
    })

    it(`Eliminando usuario`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/users/${userId}`)
            .end((err, res, body) => {

                res.status.should.equal(200);

                done()
            })
    })

})