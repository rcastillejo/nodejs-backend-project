'use strict'

const express = require('express');
const test = require('../controllers/test');
const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const accountController = require('../controllers/account');
const movementController = require('../controllers/movement');
const api = express.Router();

api.get('/holamundo', test.test);
//USERS
api.get('/users', userController.getUsers);
api.post('/users', userController.saveUser);
api.put('/users/:id', userController.updateUser);
api.delete('/users/:id', userController.removeUser);
//ACCOUNTS MOVEMENTS
api.get('/accounts', accountController.getAccounts);
api.get('/accounts/:id', accountController.getAccount);
api.post('/accounts', accountController.createAccount);
api.delete('/accounts/:id', accountController.deleteAccount);
api.post('/accounts/:id/movements', accountController.createAccountMovement);
api.get('/accounts/:id/movements', accountController.getAccountMovements);
//MOVEMENTS
api.get('/movements', movementController.getMovements);
//LOGIN
api.post('/login', authController.login);
api.post('/logout', authController.logout);

module.exports = api;
