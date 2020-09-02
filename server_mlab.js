require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const request_json = require('request-json');
const app = express();
const port = process.env.PORT || 3000;
const URL_BASE = '/apitechu/v2';
const URL_DATABASE = 'https://api.mlab.com/api/1/databases/techu22db/collections/';
const apikey_mlab ='apiKey=' +  process.env.API_KEY;
const field_param = 'f={"_id":0}';
const cors = require('cors');  // Instalar dependencia 'cors' con npm

app.use(cors());
app.options('*', cors());

app.listen(port, function(){
    console.log('NodeJS escuchando en el puerto ' + port);
});

app.use(body_parser.json()) // <==== parse request body as JSON


app.get('/holamundo',
    function(request, response){
        response.send('Hola Mundo');
    }
)

app.get(URL_BASE+'/users',
    function(request, response){
        const http_client = request_json.createClient(URL_DATABASE);
        console.log("Cliente HTTP mLab creado.");
        http_client.get(`user_account?${field_param}&${apikey_mlab}`, 
          function(error, res_mlab, body){
            var msg = {};
            if(error) {
              msg = {"msg" : "Error al recuperar users de mLab."}
                response.status(500);
            } else {
              if(body.length > 0) {
                msg = body;
              } else {
                msg = {"msg" : "Usuario no encontrado."};
                response.status(404);
              }
            }
            response.send(msg);
          });
    }
)

app.get(URL_BASE+'/users/:id',
    function(request, response){          
      const http_client = request_json.createClient(URL_DATABASE);
      let query_param = `q={"id_user":${request.params.id}}`;
      let without_account_field_param = 'f={"_id":0, "account": 0}';
      http_client.get(`user_account?${query_param}&${without_account_field_param}&${apikey_mlab}`, 
        function(error, res_mlab, body){
          var msg = {};
          if(error) {
            msg = {"msg" : "Error al recuperar user de mLab"}
              response.status(500);
          } else {
            if(body.length > 0) {
              msg = body[0];
            } else {
              console.log(`Usuario no encontrado ${request.params.id}`);
              response.status(404);
            }
          }
          response.send(msg);
        });
    }
)

app.get(URL_BASE+'/users/:id/accounts',
    function(request, response){          
      const http_client = request_json.createClient(URL_DATABASE);
      let query_param = `q={"id_user":${request.params.id}}`;
      let account_field_param = 'f={"_id":0, "account": 1}';
      http_client.get(`user_account?${query_param}&${account_field_param}&${apikey_mlab}`, 
        function(error, res_mlab, body){
          var msg = {};
          if(error) {
            msg = {"msg" : "Error al recuperar user de mLab"}
              response.status(500);
          } else {
            if(body.length > 0) {
              msg = body[0].account;
            } else {
              msg = {"msg" : `Usuario no encontrado ${request.params.id}`};
              response.status(404);
            }
          }
          response.send(msg);
        });
    }
)

app.post(URL_BASE+'/users',
    function(request, response){
      const http_client = request_json.createClient(URL_DATABASE);
      let count_param = 'c=true';
      http_client.get(`user_account?${count_param}&${apikey_mlab}`, 
        function(error, res_mlab, count){            
          let newId = count + 1;
          let newUser = {
              "id_user": newId,
              "first_name": request.body.first_name,
              "last_name": request.body.last_name,
              "email": request.body.email,
              "password": request.body.password
          };
          http_client.post(`user_account?&${apikey_mlab}`, newUser, 
            function(error, res_mlab, body){
              response.status(201).send(body);
            });
        });
    }
)

app.put(URL_BASE+'/users/:id',
    function(request, response){      
      const http_client = request_json.createClient(URL_DATABASE);
      let query_param = `q={"id_user":${request.params.id}}`;
      let field_param = 'f={"_id":1}';
      http_client.get(`user_account?${field_param}&${query_param}&${apikey_mlab}`, 
        function(error, res_mlab, body){
          let userId = body[0]._id.$oid;
          console.log('user actualizar con id', userId);          
          var updateUserComand = {
            "$set": request.body
          };
          console.log('user comando para actualizar', updateUserComand);  
          http_client.put(`user_account/${userId}?&${apikey_mlab}`, updateUserComand,
            function(error, res_mlab, body){
              response.status(200).send(body);
            });
        });
    }
)

app.delete(URL_BASE+'/users/:id',
    function(request, response){
      const http_client = request_json.createClient(URL_DATABASE);
      let query_param = `q={"id_user":${request.params.id}}`;
      let field_param = 'f={"_id":1}';
      http_client.get(`user_account?${field_param}&${query_param}&${apikey_mlab}`, 
        function(error, res_mlab, body){
          let userId = body[0]._id.$oid;
          console.log('user a eliminar con id', userId);
          http_client.delete(`user_account/${userId}?&${apikey_mlab}`, 
          function(error, res_mlab, body){
            response.status(200).send(body);
          });
        });
    }
)

// LOGIN - users.json
app.post(URL_BASE + '/login',
  function(request, response) {
    const http_client = request_json.createClient(URL_DATABASE);
    console.log("POST login");
    console.log(request.body.email);
    console.log(request.body.password);
    var user = request.body.email;
    var pass = request.body.password;
    let query_param = `q={"email":"${user}","password":"${pass}"}`;
    let field_param = 'f={"_id":1,"id_user":1,"first_name":1}';
    let limit_param = 'l=1';
    http_client.get(`user_account?${limit_param}&${field_param}&${query_param}&${apikey_mlab}`, 
      function(error, res_mlab, body){
        if(error){
          return response.status(500).send({"msg": "Error en petición a mLab."});
        }
        if (body.length < 1) { // Existe un usuario que cumple 'queryString'
          return response.status(404).send({"msg":"Usuario no válido."});
        }
        console.log('user encontrado', body[0]);    
        let userFound = body[0];
        let userId = userFound._id.$oid;
        console.log('user actualizar con id', userId);          
        var loginComand = {
          "$set": {"logged": true}
        };
        console.log('user comando para actualizar', loginComand);  
        http_client.put(`user_account/${userId}?&${apikey_mlab}`, loginComand,
          function(error, res_mlab, body){
            console.log("Login correcto!");
            response.send({'msg':'Login correcto', 'email':user, 'userid':userFound.id_user, 'name':userFound.first_name});
          }
        );
      }
    );
});

// LOGOUT - users.json
app.post(URL_BASE + '/logout',
  function(request, response) {
    const http_client = request_json.createClient(URL_DATABASE);
    console.log("POST logout");
    let user = request.body.email;
    let query_param = `q={"email":"${user}","logged":true}`;
    let field_param = 'f={"_id":1}';
    let limit_param = 'l=1';
    
    http_client.get(`user_account?${limit_param}&${field_param}&${query_param}&${apikey_mlab}`, 
      function(error, res_mlab, body){
        if(error){
          return response.status(500).send({"msg": "Error en petición a mLab."});
        }
        if (body.length < 1) {
          return response.status(404).send({"msg":"Logout failed!"});
        }
        console.log('user encontrado', body[0]);    
        let userFound = body[0];
        let userId = userFound._id.$oid;
        console.log('user actualizar con id', userId);          
        var logoutComand = {
          "$unset": {"logged": true}
        };
        console.log('user comando para actualizar', logoutComand);  
        http_client.put(`user_account/${userId}?&${apikey_mlab}`, logoutComand,
          function(error, res_mlab, body){
            console.log("Logout correcto!");
            response.send({'msg':'Logout correcto', 'email':user});
          }
        );
      }
    );
});


app.get(URL_BASE+'/total_users',
    function(request, response){
             
      const http_client = request_json.createClient(URL_DATABASE);
      let count_param = 'c=true';
      http_client.get(`user_account?${count_param}&${apikey_mlab}`, 
        function(error, res_mlab, body){
          var msg = {};
          if(error) {
            msg = {"msg" : "Error al recuperar user de mLab"}
              response.status(500);
          } else {
            msg = {"num_usuarios: ":body};
          }
          response.send(msg);
        });
    }
)