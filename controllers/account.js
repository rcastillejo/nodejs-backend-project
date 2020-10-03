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
  let queryParam = `q={"alias":"${request.body.alias}"}`;

  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      if (body.length > 0) {
        response.status(400).send({ "msg": "Cuenta ya existe" });
      } else {
        let data = {
          "alias": request.body.alias,
          "balance": request.body.balance || 0.00
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
    });
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

function createAccountMovement(request, response) {
  const client = requestJson.createClient(url);

  let movementDate = new Date();

  let fromAccount = request.params.id;
  let toAccount = request.body.to;

  client.get(`${config.mlab_collection_account_movements}/${fromAccount}?${config.mlab_key}`,
    function (err, res, body) {
      client.get(`${config.mlab_collection_account_movements}/${toAccount}?${config.mlab_key}`,
        function (err, res, body) {

          let fromAccountMovement = {
            "$push": {
              "movements": {
                "to": toAccount,
                "amount": request.body.amount * -1,
                "date": movementDate
              }
            }
          };

          let toAccountMovement = {
            "$push": {
              "movements": {
                "from": fromAccount,
                "amount": request.body.amount * 1,
                "date": movementDate
              }
            }
          };

          client.put(`${config.mlab_collection_account_movements}/${fromAccount}?&${config.mlab_key}`, fromAccountMovement,
            function (err, res, body) {
              console.log("from_account_movement_comand correcto!", fromAccountMovement);

              client.put(`${config.mlab_collection_account_movements}/${toAccount}?&${config.mlab_key}`, toAccountMovement,
                function (err, res, body) {
                  console.log("to_account_movement_comand correcto!", toAccountMovement);
                  response.status(201).send(request.body);
                }
              );
            }
          );

        });
    })
}

function getAccountMovements(request, response) {
  const client = requestJson.createClient(url);
  let account = request.params.id;
  console.log(`Consultando cuenta ${account}`);
  client.get(`${config.mlab_collection_account_movements}/${account}?${config.mlab_key}`,
    function (err, res, body) {
      console.log('respuesta', body);
      let data;
      if (err) {
        data = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body) {
          data = body.movements;
        } else {
          data = { "msg": "No tiene cuentas disponibles" };
          response.status(404);
        }
      }
      response.send(data);
    });
}

module.exports = {
  getAccounts,
  getAccount,
  createAccount,
  deleteAccount,
  createAccountMovement,
  getAccountMovements
};
