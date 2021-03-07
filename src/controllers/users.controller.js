const md5 = require('md5');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/environment/index');
const Post = require('../models/post');

class UserController {

    static create(req, res) {
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        user.save()
            .then(newUser => {
                res.status(201).send(newUser)
            })
            .catch(err => {
                console.log(err);
                res.status(400).send(err);
            });
    }

    static login(req, res) {
        console.log(req.body);
        User.findOne({
            username: req.body.username,
            password: md5(req.body.password)
        }).then(user => {
            if (!user) {
                res.sendStatus(401);
                return;
            }

            const payload = {
                _id: user._id,
                username: user.username
            };
            const token = jwt.sign(payload, jwtSecret);
            res.send({
                token: token
            });
        })
        .catch((err) => {
            console.log(err);
            res.sendStatus(500);
        });
    }

    static check(req, res) {
        const { username, email } = req.query;
        if (!username && !email) {
            res,sendStatus(400);
            return;
        }
        let property = emeil ? 'email' : 'username';
        try {
            User.exists({
                [property]: req.query[property]
            }).then(isExist => {
                req.json(isExist);
            });
        } catch(err) {
            res.status(400).json(err);
        }
    }

    static me(req, res) {
        res.send(req.user);
    }

    static async posts(req, res) {
        const { username } = req.params;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                res.sendStatus(404);
                return;
            }

            const posts = await Post
            .find({ user: user._id })
            .populate('user', ['username', 'avatar']);
            res.json(posts);
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }  
    }

    static async get(req, res) {
        const { username } = req.params;
        try {
            const user = await User.findOne({ username });
            if (!user) {
                res.sendStatus(404);
                return;
            }
            const { _id, avatar } = user;
            res.json({_id, username, avatar });
        } catch(err) {
            console.log(err)
            res.sendStatus(500);
        }
    }

    static async getAll(req, res) {
        const { username } = req.query;
        try {
            const users = await User.find({
                username: new RegExp(username, 'i')
            });
            res.json(users.map(user => ({
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    bio: user.bio,
                    createdAt: user.createdAt
                })
            ));
        } catch(err) {
            console.log(err);
            res.sendStatus(500);
        }
    }
}

module.exports = UserController;