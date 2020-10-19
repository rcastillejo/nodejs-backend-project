'use strict'

const requestJson = require('request-json');
const service = require('../services');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';
const { body, validationResult } = require('express-validator');

function login(request, response) {

  body("email", "Por favor ingrese su correo").isEmail();
  body('password', 'Por favor su correo debe contar con al menos 5 letras y un número').isLength({ min: 5 }).matches(/\d/);

  let errors = validationResult(request);
  if (!errors.isEmpty()) { response.status(400).send({ errors: errors.array() }); return; }

  var client = requestJson.createClient(url);
  let queryName = `q={"email":"${request.body.email}"}`;
  client.get(`${config.mlab_collection_users}?${queryName}&${config.mlab_key}`, function (err, res, body) {
    var respuesta = body[0];
    if (undefined != respuesta) {
      if (request.body.password == respuesta.password) {
        let change = {
          "$set": {
            "session": true
          }
        };
        let userId = respuesta._id.$oid;
        client.put(`${config.mlab_collection_users}/${userId}?${config.mlab_key}`, change, function (errP, resP, bodyP) {
          if (err) {
            response.status(500).send({ "msg": "Por el momento no podemos ayudarle" });
          } else {
            response.status(200).send({ token: service.createToken(userId) });
          }
        })
      } else {
        response.status(404).send({ "msg": "Password incorrecta" });
      }
    } else {
      response.status(404).send({ "msg": "Email incorrecto" });
    }
  });
}

function logout(request, response) {

  body("email", "Por favor ingrese su correo").isEmail();

  let errors = validationResult(request);
  if (!errors.isEmpty()) { response.status(400).send({ errors: errors.array() }); return; }

  var client = requestJson.createClient(url);
  const queryName = `q={"email":"${request.body.email}"}`;
  client.get(`${config.mlab_collection_users}?${queryName}&${config.mlab_key}`, function (err, res, body) {
    var respuesta = body[0];
    if (undefined != respuesta) {
      let change = {
        "$unset": {
          "session": true
        }
      };
      let userId = respuesta._id.$oid;
      client.put(`${config.mlab_collection_users}/${userId}?${config.mlab_key}`, change, function (errP, resP, bodyP) {
        if (err) {
          response.status(500).send({ "msg": "Por el momento no podemos ayudarle" });
        } else {
          response.status(200).send({ "msg": "LogOut correcto" })
        }
      })
    } else {
      response.status(404).send({ "msg": "Email incorrecto" });
    }
  });
}





module.exports = {
  login,
  logout
};
