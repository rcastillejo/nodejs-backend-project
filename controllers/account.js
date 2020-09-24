'use strict'

var requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';
const fieldParam = 'f={"_id":0}';

function getAccounts(request, response) {
  const client = requestJson.createClient(url);
  let queryName = request.query.iban ? `q={"iban":"${request.query.iban}"}` : '';
  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${queryName}&${config.mlab_key}`,
    function (err, res, body) {
      var msg = {};
      if (err) {
        msg = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body.length > 0) {
          msg = body;
        } else {
          msg = { "msg": "No tiene cuentas disponibles" };
          response.status(404);
        }
      }
      response.send(msg);
    });
}

function getAccount(request, response) {
  const client = requestJson.createClient(url);
  let queryName = `q={"id_account":${request.params.id}}`;
  client.get(`${config.mlab_collection_account_movements}?${field_param}&${queryName}&${config.mlab_key}`,
    function (err, res, body) {
      var msg = {};
      if (err) {
        msg = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body.length > 0) {
          msg = body;
        } else {
          msg = { "msg": "No tiene cuentas disponibles" };
          response.status(404);
        }
      }
      response.send(msg);
    });
}

function createAccount(request, response) {
  console.log('Agregando cuenta' + config.mlab_key);
  const client = requestJson.createClient(url);
  let countParam = 'c=true';
  client.get(`${config.mlab_collection_account_movements}?${countParam}&${config.mlab_key}`,
    function (err, res, count) {
      console.log('Respuesta', count);
      let newId = count + 1;
      let newAccount = request.body;
      newAccount.id_account = newId;
      client.post(`${config.mlab_collection_account_movements}?&${config.mlab_key}`, newAccount,
        function (err, res, body) {
          response.status(201).send(body);
        });
    });
}

function deleteAccount(request, response) {

  const client = requestJson.createClient(url);
  let queryParam = `q={"id_account":${request.params.id}}`;
  let fieldParam = 'f={"_id":1}';
  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      let id = body[0]._id.$oid;
      console.log('account a eliminar con id', id);
      client.delete(`${config.mlab_collection_account_movements}/${id}?&${config.mlab_key}`,
        function (err, res, body) {
          response.status(200).send(body);
        });
    });
}

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  deleteAccount
};
