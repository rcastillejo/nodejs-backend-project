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
api.post('/accounts/:id/movements', accountController.createAccountMovement);
api.get('/accounts/:id/movements', accountController.getAccountMovements);
//MOVEMENTS
api.get('/movements', movementController.getMovements);

module.exports = api;
