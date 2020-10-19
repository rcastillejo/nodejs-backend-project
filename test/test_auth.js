var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = chai.should();

chai.use(chaiHttp);


let user = {
    "firstname": "Ricardo",
    "lastname": "Castillejo",
    "email": "rcastillejo@gmail.com",
    "password": "Admin1234"
};
let userId;

describe('Iniciando y cerrando sesion', () => {

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

                done()
            })
    })

    it(`Verificando inicio de sesion de usuario`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/users?email=${user.email}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].should.have.property('session');

                res.body[0].session.should.equal(true);

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

    it(`Verificando cierre de sesion de usuario`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/users?email=${user.email}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].should.not.have.property('session');

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