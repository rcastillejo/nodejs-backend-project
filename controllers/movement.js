'use strict'

var requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';

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
  getMovements
};
