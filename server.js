const express = require('express');
const body_parser = require('body-parser');
const app = express();
const port = 3000;
const URL_BASE = '/apitechu/v1'
const users = require('./user.json');

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
        response.send(users);
    }
)

app.get(URL_BASE+'/users/:id',
    function(request, response){
        let pos = request.params.id - 1;
        response.send(users[pos]);
    }
)

app.post(URL_BASE+'/users',
    function(request, response){
        let pos = users.length + 1;
        let new_user = {
            "id": pos,
            "first_name": request.body.first_name,
            "last_name": request.body.last_name,
            "email": request.body.email,
            "password": request.body.password
        }
        users.push(new_user);
        response.send(new_user);
    }
)

app.put(URL_BASE+'/users/:id',
    function(request, response){
        console.log('request.params', request.params);
        let pos = request.params.id - 1;
        let put_user = users[pos];
        console.log('user', put_user);
        console.log('request.body', request.body);
        put_user.first_name = request.body.first_name;
        put_user.last_name = request.body.last_name;
        put_user.email = request.body.email;
        put_user.password = request.body.password;
        users[pos] = put_user;
        response.send(put_user);
    }
)

app.delete(URL_BASE+'/users/:id',
    function(request, response){
        let pos = users.findIndex(user => user.id == request.params.id);
        console.log('user a eliminar en posicion', pos);
        users.splice(pos, 1);
        response.send({"msg": "Usuario eliminado: "+ request.params.id + ", en posicion: "+ pos});
    }
)

// Petición GET con Query String (req.query)
app.get(URL_BASE + '/users',
  function(req, res) {
    console.log("GET con query string.");
    console.log(req.query.id);
    console.log(req.query.country);
    let pos = users.findIndex(user => user.id == req.query.id);
    res.send(users[pos - 1]);
    respuesta.send({"msg" : "GET con query string"});
});

// LOGIN - users.json
app.post(URL_BASE + '/login',
  function(request, response) {
    console.log("POST login");
    console.log(request.body.email);
    console.log(request.body.password);
    var user = request.body.email;
    var pass = request.body.password;
    for(us of users) {
      if(us.email == user) {
        if(us.password == pass) {
          us.logged = true;
          writeUserDataToFile(users);
          console.log("Login correcto!");
          response.send({"msg" : "Login correcto.", "idUsuario" : us.id, "logged" : "true"});
        } else {
          console.log("Login incorrecto.");
          response.status(400).send({"msg" : "Login incorrecto."});
        }
      }
    }
});

function writeUserDataToFile(data) {
    var fs = require('fs');
    var jsonUserData = JSON.stringify(data);
    fs.writeFile("./user.json", jsonUserData, "utf8",
     function(err) { //función manejadora para gestionar errores de escritura
       if(err) {
         console.log(err);
       } else {
         console.log("Datos escritos en 'users.json'.");
       }
     }); }

// LOGOUT - users.json
app.post(URL_BASE + '/logout/:id',
  function(request, response) {
    console.log("POST logout");
    var userId = request.params.id;
    for(us of users) {
      if(us.id == userId) {
        if(us.logged) {
          delete us.logged; // borramos propiedad 'logged'
          writeUserDataToFile(users);
          console.log("Logout correcto!");
          response.send({"msg" : "Logout correcto.", "idUsuario" : us.id});
        } else {
          console.log("Logout incorrecto.");
          response.status(400).send({"msg" : "Logout incorrecto."});
        }
      }
    }
});


app.get(URL_BASE+'/total_users',
    function(request, response){
        response.send({"num_usuarios":users.length});
    }
)