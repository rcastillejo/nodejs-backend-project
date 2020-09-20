require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const request_json = require('request-json');
const app = express();
const port = process.env.PORT || 3000;
const URL_BASE = '/apitechu/v0';
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

app.get(URL_BASE+'/accounts',
    function(request, response){
        const http_client = request_json.createClient(URL_DATABASE);
        console.log("Cliente HTTP mLab creado.");
        http_client.get(`account_movements?${field_param}&${apikey_mlab}`, 
          function(error, res_mlab, body){
            var msg = {};
            if(error) {
              msg = {"msg" : "Por el momento no podemos ayudarle"}
                response.status(500);
            } else {
              if(body.length > 0) {
                msg = body;
              } else {
                msg = {"msg" : "No tiene cuentas disponibles"};
                response.status(404);
              }
            }
            response.send(msg);
          });
    }
)

app.get(URL_BASE+'/accounts/:id',
    function(request, response){
        const http_client = request_json.createClient(URL_DATABASE);
        let query_param = `q={"id_account":${request.params.id}}`;
        console.log("Cliente HTTP mLab creado.");
        http_client.get(`account_movements?${field_param}&${query_param}&${apikey_mlab}`, 
          function(error, res_mlab, body){
            var msg = {};
            if(error) {
              msg = {"msg" : "Por el momento no podemos ayudarle"}
                response.status(500);
            } else {
              if(body.length > 0) {
                msg = body;
              } else {
                msg = {"msg" : "No tiene cuentas disponibles"};
                response.status(404);
              }
            }
            response.send(msg);
          });
    }
)

app.post(URL_BASE+'/accounts',
    function(request, response){
      const http_client = request_json.createClient(URL_DATABASE);
      let count_param = 'c=true';
      http_client.get(`account_movements?${count_param}&${apikey_mlab}`, 
        function(error, res_mlab, count){            
          let newId = count + 1;
          let newAccount = request.body;
          newAccount.id_account = newId;
          http_client.post(`account_movements?&${apikey_mlab}`, newAccount, 
            function(error, res_mlab, body){
              response.status(201).send(body);
            });
        });
    }
)

app.delete(URL_BASE+'/accounts/:id',
    function(request, response){
      const http_client = request_json.createClient(URL_DATABASE);
      let query_param = `q={"id_account":${request.params.id}}`;
      let field_param = 'f={"_id":1}';
      http_client.get(`account_movements?${field_param}&${query_param}&${apikey_mlab}`, 
        function(error, res_mlab, body){
          let id = body[0]._id.$oid;
          console.log('account a eliminar con id', id);
          http_client.delete(`account_movements/${id}?&${apikey_mlab}`, 
          function(error, res_mlab, body){
            response.status(200).send(body);
          });
        });
    }
)
