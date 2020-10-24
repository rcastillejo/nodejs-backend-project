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

describe('Cuentas & movimientos', () => {

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
                console.log('body', body);
                res.status.should.equal(200);

                res.body.should.have.property('token');

                token = res.body.token;

                done()
            })
    })

    describe('Agregando un nueva cuenta y eliminandola', () => {

        let alias = "DEMO";
        let account;

        it(`Agregando cuenta ${alias}`, (done) => {
            chai.request('http://localhost:3000')
                .post('/apitechu/v0/accounts')
                .set({ "Authorization": `Bearer ${token}` })
                .send({ "alias": alias })
                .end((err, res, body) => {
                    console.log('res', res.text);
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
                .set({ "Authorization": `Bearer ${token}` })
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
                .get(`/apitechu/v0/accounts`)
                .set({ "Authorization": `Bearer ${token}` })
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
                .set({ "Authorization": `Bearer ${token}` })
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

        it(`Verificando balance cuenta1`, (done) => {
            chai.request('http://localhost:3000')
                .get(`/apitechu/v0/accounts/${account1}`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('balance');
                    res.body.balance.should.equal(0.00);
                    done()
                })
        })

        it(`Verificando balance cuenta2`, (done) => {
            chai.request('http://localhost:3000')
                .get(`/apitechu/v0/accounts/${account2}`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('balance');
                    res.body.balance.should.equal(1.00);
                    done()
                })
        })

        it(`Transfiriendo de cuenta2 a cuenta1`, (done) => {
            chai.request('http://localhost:3000')
                .post(`/apitechu/v0/accounts/${account2}/movements`)
                .set({ "Authorization": `Bearer ${token}` })
                .send({ "to": account1, "amount": 1.00 })
                .end((err, res, body) => {
                    res.status.should.equal(201);
                    done()
                })
        })

        it(`Verificando balance cuenta1 de la 2da transferencia`, (done) => {
            chai.request('http://localhost:3000')
                .get(`/apitechu/v0/accounts/${account1}`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('balance');
                    res.body.balance.should.equal(1.00);
                    done()
                })
        })

        it(`Verificando balance cuenta2 de la 2da transferencia`, (done) => {
            chai.request('http://localhost:3000')
                .get(`/apitechu/v0/accounts/${account2}`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {
                    res.status.should.equal(200);
                    res.body.should.have.property('balance');
                    res.body.balance.should.equal(0.00);
                    done()
                })
        })

        it(`Consultando movimientos de cuenta1`, (done) => {
            chai.request('http://localhost:3000')
                .get(`/apitechu/v0/accounts/${account1}/movements`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {
                    res.status.should.equal(200);
                    res.body.length.should.equal(2);

                    res.body[0].should.have.property('to');
                    res.body[0].should.have.property('amount');
                    res.body[0].should.have.property('date');

                    res.body[0].to.should.equal(account2);
                    res.body[0].amount.should.equal(-1.00);

                    res.body[1].should.have.property('from');
                    res.body[1].should.have.property('amount');
                    res.body[1].should.have.property('date');

                    res.body[1].from.should.equal(account2);
                    res.body[1].amount.should.equal(1.00);

                    done()
                })
        })

        it(`Consultando movimientos de cuenta2`, (done) => {
            chai.request('http://localhost:3000')
                .get(`/apitechu/v0/accounts/${account2}/movements`)
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {
                    res.status.should.equal(200);
                    res.body.length.should.equal(2);

                    res.body[0].should.have.property('from');
                    res.body[0].should.have.property('amount');
                    res.body[0].should.have.property('date');

                    res.body[0].from.should.equal(account1);
                    res.body[0].amount.should.equal(1.00);

                    res.body[1].should.have.property('to');
                    res.body[1].should.have.property('amount');
                    res.body[1].should.have.property('date');

                    res.body[1].to.should.equal(account1);
                    res.body[1].amount.should.equal(-1.00);
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

    })

    describe('Agregando un nueva cuenta ya existente', () => {

        let alias = "DEMO";
        let account;
        it(`Agregando cuenta ${alias}`, (done) => {
            chai.request('http://localhost:3000')
                .post('/apitechu/v0/accounts')
                .set({ "Authorization": `Bearer ${token}` })
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
                .set({ "Authorization": `Bearer ${token}` })
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
                .set({ "Authorization": `Bearer ${token}` })
                .end((err, res, body) => {

                    res.status.should.equal(200);

                    done()
                })
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

});