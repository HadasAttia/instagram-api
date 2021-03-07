const express = require('express');
const multer = require('multer');
const PostsController = require('../controllers/posts.controller');
const UserController = require('../controllers/users.controller');
const auth = require('../middlewares/auth');
const routes = express.Router();
const upload = multer({ dest: 'public/posts' });

routes.put('/user', UserController.create);
routes.post('/user/login', UserController.login);
routes.post('/user/me', auth, UserController.me);
routes.get('/user/check', UserController.check);
routes.get('/user/:username/posts', auth, UserController.posts);
routes.get('/user/:username', auth, UserController.get);
routes.get('/user', auth, UserController.getAll);

routes.get('/post', auth, PostsController.feed);
routes.put('/post', auth, upload.single('image'), PostsController.create);
routes.get('/post/:id', auth, PostsController.get);

module.exports = routes;