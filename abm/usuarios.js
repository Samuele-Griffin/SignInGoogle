const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const { verificarAdmin, verificarToken } = require('../middlewares/auth');

app.get('/users', [verificarToken], (req, res) => {

    let start = Number(req.query.start || 0);
    let limit = Number(req.query.limit || 0);
    User.find({ status: true }, 'name email google status')
        .skip(start)
        .limit(limit)
        .exec((err, users) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: err.errors,
                });
            }
            User.count({ status: true }, (err, cont) => {
                res.json({
                    ok: true,
                    ...users,
                    cont,
                })
            });
        });
});

app.post('/users', [verificarToken, verificarAdmin], (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        email: body.email,
        google: body.google,
        status: true,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
    });
    user.save((err, users) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.errors,
            });
        }
        res.json({
            ok: true,
            user: users,
        })
    });
});

app.put('/users/:id', [verificarToken, verificarAdmin], (req, res) => {
    let id = req.params.id;
    let body = req.body;
    User.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, users) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err.errors,
            });
        }
        res.json({
            ok: true,
            user: users,
        })
    });
});

app.delete('/users/:id', [verificarToken, verificarAdmin], (req, res) => {
    let id = req.params.id;
    let eraseUser = {
        status: false,
    };
    User.findByIdAndUpdate(id, eraseUser, { new: true }, (err, users) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: {
                    ...err,
                }
            });
        }
        res.json({
            ok: true,
            user: users,
        })
    });
});

module.exports = app;