const express = require('express');
const app = express();
const port = 3000;

app.listen(port);
console.log('NodeJS escuchando en el puerto ' + port);


app.get('/holamundo',
    function(request, response){
        response.send('Hola Mundo');
    }
)