const express = require('express');
const UserController = require('../controllers/users.controller');
const routes = express.Router();

routes.put('/user', UserController.create);
routes.post('/user/login', UserController.login);
routes.post('/user/me', UserController.me);
routes.get('/user/check', UserController.check);

module.exports = routes;