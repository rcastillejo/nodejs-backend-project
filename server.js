const express = require('express');
const app = express();
const port = 3000;
const URL_BASE = '/techU/v1'
let users;

app.use(express.json()) // <==== parse request body as JSON

app.listen(port, function(){
    console.log('NodeJS escuchando en el puerto ' + port);
    var fs = require('fs');
    users = JSON.parse(fs.readFileSync('user.json', 'utf8'));
});


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
            "ID": pos,
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
        let pos = users.findIndex(user => user.ID == request.params.id);
        console.log('user a eliminar en posicion', pos);
        users.splice(pos, 1);
        response.send({"msg": "Usuario eliminado: "+ request.params.id + ", en posicion: "+ pos});
    }
)