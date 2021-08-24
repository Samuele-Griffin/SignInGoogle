const express = require('express');
const app = express();
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {

    let body = req.body;

    User.findOne({ email: body.email }, (err, usuariodb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err.errors,
            });
        }
        if (!usuariodb) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Nombre de usuario no encontrado en la base de datos',
                },
            });
        }
        if (!bcrypt.compareSync(body.password, usuariodb.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Contraseñas incorrectas, vuelvalo a intentar',
                },
            });
        }

        let token = jwt.sign({
            user: usuariodb,
        }, process.env.SIGN, { expiresIn: process.env.EXPIRES });

        res.json({
            ok: true,
            user: usuariodb,
            token,
        })
    });
});

let verify = async(token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    })
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
};

app.post('/google', async(req, res) => {
    let googleUser = await verify(req.body.idtoken)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: err
            })
        });
    User.findOne({ email: googleUser.email }, (err, userDB) => {
        if (err) {
            res.status(403).json({ ok: false, message: err.errors });
        }
        if (userDB) {
            if (!userDB.google) {
                res.status(403).json({ ok: false, message: { err } });
            }
            let token = jwt.sign({
                user: userDB,
            }, process.env.SIGN, { expiresIn: process.env.EXPIRES });
            return res.json({
                ok: true,
                user: userDB,
                token,
            })
        } else {
            let user = new User({
                name: googleUser.name,
                email: googleUser.email,
                img: googleUser.img,
                google: true,
                password: bcrypt.hashSync('77', 10),
            });

            user.save((err, userDB) => {
                if (err) {
                    return res.status(400).json({ ok: false, message: { err } });
                }
                let token2 = jwt.sign({
                    user: userDB,
                }, process.env.SIGN, { expiresIn: process.env.EXPIRES });
                return res.json({
                    ok: true,
                    user: userDB,
                    token2,
                })
            });
        }
    });
});

module.exports = app;