var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var mocks = require('./mocks');

var should = chai.should();

chai.use(chaiHttp);


let user = mocks.user;
let userId;

describe('Agregando un usuario y eliminandolo', () => {

    it(`Agregando usuario`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/users')
            .send(user)
            .end((err, res, body) => {

                res.status.should.equal(201);

                res.body.should.have.property('id');
                res.body.should.have.property('firstname');
                res.body.should.have.property('lastname');
                res.body.should.have.property('email');
                res.body.should.not.have.property('password');
                res.body.should.have.property('gender');

                res.body.firstname.should.equal(user.firstname);
                res.body.lastname.should.equal(user.lastname);
                res.body.email.should.equal(user.email);
                res.body.gender.should.equal(user.gender);

                userId = res.body.id;

                done()
            })
    })

    it(`Consultando usuario`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/users?email=${user.email}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].should.have.property('id');
                res.body[0].should.have.property('firstname');
                res.body[0].should.have.property('lastname');
                res.body[0].should.have.property('email');
                res.body[0].should.not.have.property('password');
                res.body[0].should.have.property('gender');

                res.body[0].id.should.equal(userId);
                res.body[0].firstname.should.equal(user.firstname);
                res.body[0].lastname.should.equal(user.lastname);
                res.body[0].email.should.equal(user.email);
                res.body[0].gender.should.equal(user.gender);

                done()
            })
    })

    it(`Agregando usuario que ya existente`, (done) => {
        chai.request('http://localhost:3000')
            .post('/apitechu/v0/users')
            .send(user)
            .end((err, res, body) => {

                res.status.should.equal(400);

                res.body.msg.should.equal("El usuario ya existe");

                done()
            })
    })

    it(`Actualizando usuario que ya existente`, (done) => {
        user.firstname = "Luis";
        chai.request('http://localhost:3000')
            .put('/apitechu/v0/users/' + userId)
            .send(user)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.should.not.have.property('password');
                done()
            })
    })

    it(`Consultando usuario actualizado`, (done) => {
        chai.request('http://localhost:3000')
            .get(`/apitechu/v0/users?email=${user.email}`)
            .end((err, res, body) => {
                res.status.should.equal(200);
                res.body.length.should.equal(1);

                res.body[0].should.have.property('id');
                res.body[0].should.have.property('firstname');
                res.body[0].should.have.property('lastname');
                res.body[0].should.have.property('email');
                res.body[0].should.not.have.property('password');
                res.body[0].should.have.property('gender');

                res.body[0].id.should.equal(userId);
                res.body[0].firstname.should.equal(user.firstname);
                res.body[0].lastname.should.equal(user.lastname);
                res.body[0].email.should.equal(user.email);
                res.body[0].gender.should.equal(user.gender);

                done()
            })
    })

    it(`Eliminando usuario`, (done) => {
        chai.request('http://localhost:3000')
            .delete(`/apitechu/v0/users/${userId}`)
            .end((err, res, body) => {

                res.status.should.equal(200);

                res.body.should.have.property('id');
                res.body.should.have.property('firstname');
                res.body.should.have.property('lastname');
                res.body.should.have.property('email');
                res.body.should.not.have.property('password');

                done()
            })
    })

})