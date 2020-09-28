'use strict'

const express = require('express');

const bodyParser = require('body-parser');
const config = require('./config');
const api = require('./routes');
const cors = require('cors');

const app = express();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(config.URLbase, api);


module.exports = app;
