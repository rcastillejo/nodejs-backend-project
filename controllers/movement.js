'use strict'

var requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';

function createMovement(request, response) {
  const client = requestJson.createClient(url);
  let date_movement = new Date();
  let from_account_query = `q={"iban":"${request.body.from_iban}"}`;
  let account_field = 'f={"_id":1}';
  client.get(`${config.mlab_collection_account_movements}?${from_account_query}&${account_field}&${config.mlab_key}`,
    function (err, res, body) {
      console.log('fromn account', body);
      let from_account_id = body[0]._id.$oid;

      let to_account_query = `q={"iban":"${request.body.to_iban}"}`;
      client.get(`${config.mlab_collection_account_movements}?${to_account_query}&${account_field}&${config.mlab_key}`,

        function (err, res, body) {
          let to_account_id = body[0]._id.$oid;

          let from_account_movement_comand = {
            "$push": {
              "movements": {
                "amount": request.body.amount * -1,
                "date": date_movement
              }
            }
          };

          let to_account_movement_comand = {
            "$push": {
              "movements": {
                "amount": request.body.amount * 1,
                "date": date_movement
              }
            }
          };

          client.put(`${config.mlab_collection_account_movements}/${from_account_id}?&${config.mlab_key}`, from_account_movement_comand,
            function (err, res, body) {
              console.log("from_account_movement_comand correcto!", from_account_movement_comand);

              client.put(`${config.mlab_collection_account_movements}/${to_account_id}?&${config.mlab_key}`, to_account_movement_comand,
                function (err, res, body) {
                  console.log("to_account_movement_comand correcto!", to_account_movement_comand);
                  response.status(201).send(request.body);
                }
              );
            }
          );

        });
    })
}

function getMovements(request, response) {
  const client = requestJson.createClient(url);
  let fieldParam = 'f={"_id":0, "movements":1, "iban": 1}';
  client.get(`${config.mlab_collection_account_movements}?${fieldParam}&${config.mlab_key}`,
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

module.exports = {
  getMovements,
  createMovement
};
