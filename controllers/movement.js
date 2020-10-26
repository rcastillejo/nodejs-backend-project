'use strict'

var requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';

function getMovements(request, response) {
  const client = requestJson.createClient(url);
  let queryParam = `q={"user": "${request.user}"}`;
  client.get(`${config.mlab_collection_account_movements}?${queryParam}&${config.mlab_key}`,
    function (err, res, body) {
      var msg = {};
      if (err) {
        msg = { "msg": "Por el momento no podemos ayudarle" }
        response.status(500);
      } else {
        if (body.length > 0) {
          msg = new Array();
          body.map(function (acc) {
            if (acc.movements) {
              acc.movements.map(function (mov) {
                msg.push({
                  "alias": acc.alias,
                  "amount": mov.amount,
                  "date": mov.date
                });
              })
            }
          });

          if (msg.length > 0) {
            msg.sort(function (a, b) {
              return new Date(b.date) - new Date(a.date);
            });
          } else {
            msg = { "msg": "No tiene movimientos disponibles" };
            response.status(404);
          }
        } else {
          msg = { "msg": "No tiene cuentas disponibles" };
          response.status(404);
        }
      }
      response.send(msg);
    });
}

module.exports = {
  getMovements
};
