const md5 = require('md5');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/enviroment/index')

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
                res.status(401);
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
            res.status(500).send(err)
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
        try {
            const payload = jwt.verify(req.body.token, jwtSecret);
            User.findById(payload._id)
                .then(user => {
                    if (!user) {
                        res.sendStatus(401);
                        return;
                }
                res.send({
                    _id: user.id,
                    username: user.username,
                    email: user.email
                });
            }).catch(err => {
                console.log(err);
                res.sendStatus(500)
            });
        } catch(err) {
            res.sendStatus(401);
        }
    }
}

module.exports = UserController;