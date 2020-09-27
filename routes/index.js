'use strict'

const express = require('express');
const test = require('../controllers/test');
const accountController = require('../controllers/account');
const movementController = require('../controllers/movement');
const api = express.Router();

api.get('/holamundo', test.test);
//ACCOUNTS
api.get('/accounts', accountController.getAccounts);
api.get('/accounts/:id', accountController.getAccount);
api.post('/accounts', accountController.createAccount);
api.delete('/accounts/:id', accountController.deleteAccount);
//MOVEMENTS
api.get('/movements', movementController.getMovements);
api.post('/movements', movementController.createMovement);

module.exports = api;