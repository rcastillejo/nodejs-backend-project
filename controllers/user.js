'use strict'

const requestJson = require('request-json');
const config = require('../config');
const url = config.mlab_host + config.mlab_db + 'collections/';
const { body, validationResult } = require('express-validator');

function getUsers(request, response) {
  let client = requestJson.createClient(url);
  let queryParam = `q={"email":"${request.query.email}"}`;
  client.get(`${config.mlab_collection_users}?${queryParam}&${config.mlab_key}`, function (err, res, body) {
    let data;
    if (err) {
      data = { "msg": "Por el momento no podemos ayudarle" }
      response.status(500);
    } else {
      if (body.length > 0) {
        data = body.map(function (val) {
          return {
            "id": val._id.$oid,
            "firstname": val.first_name,
            "lastname": val.last_name,
            "email": val.email,
            "session": val.session,
            "gender": val.gender,
          }
        });
      } else {
        data = { "msg": "El usuario no existe" };
        response.status(404);
      }
    }
    response.send(data);
  });
}

function saveUser(request, response) {
  body("firstname", "Por favor ingrese su nombre").notEmpty();
  body("lastname", "Por favor ingrese su apellido").notEmpty();
  body("email", "Por favor ingrese su correo").isEmail();
  body('password', 'Por favor su correo debe contar con al menos 5 letras y un número').isLength({ min: 5 }).matches(/\d/);

  let errors = validationResult(request);;
  if (!errors.isEmpty()) {response.status(400).send({ errors: errors.array() }); return; }

  let client = requestJson.createClient(url);

  let queryParam = `q={"email":"${request.body.email}"}`;

  client.get(`${config.mlab_collection_users}?${queryParam}&${config.mlab_key}`, function (err, res, body) {
    if (body.length > 0) {
      response.status(400).send({ "msg": "El usuario ya existe" });
    } else {

      let data = {
        "first_name": request.body.firstname,
        "last_name": request.body.lastname,
        "email": request.body.email,
        "password": request.body.password,
        "gender": request.body.gender
      };
      client.post(`${config.mlab_collection_users}?${config.mlab_key}`, data, function (err, res, body) {
        if (err) {
          data = { "msg": "Por el momento no podemos ayudarle" }
          response.status(500);
        } else {
          response.status(201).send({
            "id": body._id.$oid,
            "firstname": body.first_name,
            "lastname": body.last_name,
            "email": body.email,
            "gender": body.gender
          });
        }
      });
    }
  });

};

function updateUser(request, response) {

  body("firstname", "Por favor ingrese su nombre").notEmpty();
  body("lastname", "Por favor ingrese su apellido").notEmpty();
  body("email", "Por favor ingrese su correo").isEmail();

  let errors = validationResult(request);;
  if (!errors.isEmpty()) {response.status(400).send({ errors: errors.array() }); return; }

  const client = requestJson.createClient(url);
  let userId = request.params.id;
  let userToUpdate = {
    "$set": {
      "first_name": request.body.firstname,
      "last_name": request.body.lastname,
      "email": request.body.email,
      "gender": request.body.gender
    }
  };
  client.put(`${config.mlab_collection_users}/${userId}?&${config.mlab_key}`, userToUpdate, function (err, resM, body) {
    response.send({
      "id": body._id.$oid,
      "firstname": body.first_name,
      "lastname": body.last_name,
      "email": body.email,
      "gender": body.gender
    });
  });
};

function removeUser(request, response) {
  let userId = request.params.id;

  let client = requestJson.createClient(url);

  client.get(`${config.mlab_collection_users}/${userId}?&${config.mlab_key}`, function (err, res, body) {
    if (body) {
      client.delete(`${config.mlab_collection_users}/${userId}?&${config.mlab_key}`, function (err, res, body) {
        if (err) {
          data = { "msg": "Por el momento no podemos ayudarle" }
          response.status(500);
        } else {
          response.send({
            "id": body._id.$oid,
            "firstname": body.first_name,
            "lastname": body.last_name,
            "email": body.email,
            "gender": body.gender
          });
        }
      });
    } else {
      data = { "msg": "El usuario no existe" };
      response.status(404);
    }
  });
};


module.exports = {
  getUsers,
  saveUser,
  updateUser,
  removeUser
};
