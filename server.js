'use strict'

const app = require('./app');
const config = require('./config');

app.listen(config.port, () => {
  console.log('(Modularizado) NodeJS escuchando en el puerto ' + config.port);
});
