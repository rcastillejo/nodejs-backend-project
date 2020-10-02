var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');

var should = chai.should();

chai.use(chaiHttp);

let alias = "DEMO";
let account; 
describe('Agregando un nueva cuenta y eliminandola', () => {

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