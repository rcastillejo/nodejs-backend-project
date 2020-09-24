require('dotenv').config();
const express = require('express');
const body_parser = require('body-parser');
const requestJson = require('request-json');
const config = require('./config');
const app = express();
const URL_BASE = '/apitechu/v0';
const url=config.mlab_host+config.mlab_db+'collections/';
const field_param = 'f={"_id":0}';
const cors = require('cors');  // Instalar dependencia 'cors' con npm

app.use(cors());
app.options('*', cors());

app.listen(config.port, function(){
    console.log('NodeJS escuchando en el puerto ' + config.port);
});

app.use(body_parser.json()) // <==== parse request body as JSON


app.get('/holamundo',
    function(request, response){
        response.send('Hola Mundo');
    }
)

app.get(URL_BASE+'/accounts',
    function(request, response){
        const http_client = requestJson.createClient(url);
        let query_param = request.query.iban ? `q={"iban":"${request.query.iban}"}` : '';
        http_client.get(`${config.mlab_collection_account_movements}?${field_param}&${query_param}&${config.mlab_key}`, 
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
        const http_client = requestJson.createClient(url);
        let query_param = `q={"id_account":${request.params.id}}`;
        console.log("Cliente HTTP mLab creado.");
        http_client.get(`${config.mlab_collection_account_movements}?${field_param}&${query_param}&${config.mlab_key}`, 
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
      const http_client = requestJson.createClient(url);
      let count_param = 'c=true';
      http_client.get(`${config.mlab_collection_account_movements}?${count_param}&${config.mlab_key}`, 
        function(error, res_mlab, count){            
          let newId = count + 1;
          let newAccount = request.body;
          newAccount.id_account = newId;
          http_client.post(`${config.mlab_collection_account_movements}?&${config.mlab_key}`, newAccount, 
            function(error, res_mlab, body){
              response.status(201).send(body);
            });
        });
    }
)

app.delete(URL_BASE+'/accounts/:id',
    function(request, response){
      const http_client = requestJson.createClient(url);
      let query_param = `q={"id_account":${request.params.id}}`;
      let field_param = 'f={"_id":1}';
      http_client.get(`${config.mlab_collection_account_movements}?${field_param}&${query_param}&${config.mlab_key}`, 
        function(error, res_mlab, body){
          let id = body[0]._id.$oid;
          console.log('account a eliminar con id', id);
          http_client.delete(`${config.mlab_collection_account_movements}/${id}?&${config.mlab_key}`, 
          function(error, res_mlab, body){
            response.status(200).send(body);
          });
        });
    }
)


app.post(URL_BASE+'/movements',
    function(request, response){
      const http_client = requestJson.createClient(url);
      let date_movement = new Date();
      let from_account_query = `q={"iban":"${request.body.from_iban}"}`;
      let account_field = 'f={"_id":1}';
      http_client.get(`${config.mlab_collection_account_movements}?${from_account_query}&${account_field}&${config.mlab_key}`, 
        function(error, res_mlab, body){
          console.log('fromn account', body);
          let from_account_id = body[0]._id.$oid;
          
          let to_account_query = `q={"iban":"${request.body.to_iban}"}`;
          http_client.get(`${config.mlab_collection_account_movements}?${to_account_query}&${account_field}&${config.mlab_key}`, 
          
          function(error, res_mlab, body){
            let to_account_id = body[0]._id.$oid;
                  
            let from_account_movement_comand = {
              "$push": {"movements": {
                "amount": request.body.amount * -1,
                "date": date_movement
              }}
            };
            
            let to_account_movement_comand = {
              "$push": {"movements": {
                "amount": request.body.amount * 1,
                "date": date_movement
              }}
            };

            http_client.put(`${config.mlab_collection_account_movements}/${from_account_id}?&${config.mlab_key}`, from_account_movement_comand,
              function(error, res_mlab, body){
                console.log("from_account_movement_comand correcto!", from_account_movement_comand);

                http_client.put(`${config.mlab_collection_account_movements}/${to_account_id}?&${config.mlab_key}`, to_account_movement_comand,
                  function(error, res_mlab, body){
                    console.log("to_account_movement_comand correcto!", to_account_movement_comand);
                    response.status(201).send(request.body);
                  }
                );
              }
            );

          });
    })
  })

  
app.get(URL_BASE+'/movements',
  function(request, response){
      const http_client = requestJson.createClient(url);
      let field_param = 'f={"_id":0, "movements":1, "iban": 1}';
      http_client.get(`${config.mlab_collection_account_movements}?${field_param}&${config.mlab_key}`, 
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