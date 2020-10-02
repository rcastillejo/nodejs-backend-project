'use strict'

var requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';
const fieldParam = 'f={"_id":0}';

function getAccounts(request, response) {
  const client = requestJson.createClient(url);
  let queryParam = request.query.alias ? `q={"alias":"${request.query.alias}"}` : '';
  console.log(`Consultando cuentas ${queryParam}`);
  client.get(`${config.mlab_collection_account_movements}?${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      let data;
      if (err) {
        data = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body.length > 0) {
          data = body.map(function (val) {
            console.log("account", val);
            return {
              "account": val._id.$oid,
              "alias": val.alias,
              "balance": val.balance
            }
          });
        } else {
          data = { "msg": "No tiene cuentas disponibles" };
          response.status(404);
        }
      }
      response.send(data);
    });
}

function getAccount(request, response) {
  const client = requestJson.createClient(url);
  let queryParam = `q={"_id": {"$oid": "${request.params.id}"}}`;
  console.log(`Consultando cuenta ${queryParam}`);
  client.get(`${config.mlab_collection_account_movements}?${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      let data;
      if (err) {
        data = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body.length > 0) {
          data = {
            "account": body[0]._id.$oid,
            "alias": body[0].alias,
            "balance": body[0].balance
          };
        } else {
          data = { "msg": "No tiene cuentas disponibles" };
          response.status(404);
        }
      }
      response.send(data);
    });
}

function createAccount(request, response) {
  console.log('Agregando cuenta');
  const client = requestJson.createClient(url);

  let data = {
    "alias": request.body.alias,
    "balance": 0.00
  };

  client.post(`${config.mlab_collection_account_movements}?&${config.mlab_key}`, data,
    function (err, res, body) {
      response.status(201).send({
        "account": body._id.$oid,
        "alias": body.alias,
        "balance": body.balance
      });
    }
  );
}

function deleteAccount(request, response) {

  const client = requestJson.createClient(url);
  let queryParam = `q={"_id": {"$oid": "${request.params.id}"}}`;
  let fieldParam = 'f={"_id":1}';
  console.log(`Elimando cuenta ${queryParam}`);
  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      let id = body[0]._id.$oid;
      console.log('account a eliminar con id', id);
      client.delete(`${config.mlab_collection_account_movements}/${id}?&${config.mlab_key}`,
        function (err, res, body) {
          response.status(200).send({
            "account": body._id.$oid,
            "alias": body.alias,
            "balance": body.balance
          });
        });
    });
}

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  deleteAccount
};
