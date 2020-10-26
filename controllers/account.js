'use strict'

var requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';
const fieldParam = 'f={"_id":0}';

function getAccounts(request, response) {
  const client = requestJson.createClient(url);
  let queryParam = `q={"user": "${request.user}"}`;
  client.get(`${config.mlab_collection_account_movements}?${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      let data;
      if (err) {
        data = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body.length > 0) {
          data = body.map(function (val) {
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
  let queryParam = `q={"user": "${request.user}", "_id": {"$oid": "${request.params.id}"}}`;
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
  const client = requestJson.createClient(url);
  let queryParam = `q={"user": "${request.user}", "alias":"${request.body.alias}"}`;

  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      if (body.length > 0) {
        response.status(400).send({ "msg": "Cuenta ya existe" });
      } else {
        let data = {
          "user": request.user,
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
  let queryParam = `q={"user": "${request.user}", "_id": {"$oid": "${request.params.id}"}}`;
  let fieldParam = 'f={"_id":1}';
  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      let id = body[0]._id.$oid;
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
      let fromAccountBalance = body.balance;
      if (request.body.amount > fromAccountBalance) {
        response.status(400).send({ "msg": "La cuenta no tiene suficiente saldo" });
      } else {

        client.get(`${config.mlab_collection_account_movements}/${toAccount}?${config.mlab_key}`,
          function (err, res, body) {
            if (res.statusCode === 200) {
              let toAccountBalance = body.balance;

              let fromAccountBalanceInc = request.body.amount * -1;
              let fromAccountMovement = {
                "$inc": {
                  "balance": fromAccountBalanceInc
                },
                "$push": {
                  "movements": {
                    "to": toAccount,
                    "amount": fromAccountBalanceInc,
                    "date": movementDate
                  }
                }
              };

              let toAccountBalanceInc = request.body.amount;
              let toAccountMovement = {
                "$inc": {
                  "balance": toAccountBalanceInc
                },
                "$push": {
                  "movements": {
                    "from": fromAccount,
                    "amount": toAccountBalanceInc,
                    "date": movementDate
                  }
                }
              };

              client.put(`${config.mlab_collection_account_movements}/${fromAccount}?&${config.mlab_key}`, fromAccountMovement,
                function (err, res, body) {
                  client.put(`${config.mlab_collection_account_movements}/${toAccount}?&${config.mlab_key}`, toAccountMovement,
                    function (err, res, body) {
                      response.status(201).send(request.body);
                    }
                  );
                }
              );

            } else {
              response.status(400).send({ "msg": "La cuenta destino no existe" });
            }
          });

      }
    })
}

function getAccountMovements(request, response) {
  const client = requestJson.createClient(url);
  let account = request.params.id;
  client.get(`${config.mlab_collection_account_movements}/${account}?${config.mlab_key}`,
    function (err, res, body) {
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
