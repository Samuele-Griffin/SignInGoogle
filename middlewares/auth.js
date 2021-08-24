const jwt = require('jsonwebtoken');

module.exports.verificarToken = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.SIGN, (err, decoded) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: {
                    error: err,
                }
            })
        }
        req.user = decoded.user;
        next();
    });
};

module.exports.verificarAdmin = (req, res, next) => {
    let role = req.user.role;
    if (role === 'admin') {
        next();
        return;
    }
    res.status(400).json({
        ok: false,
        message: 'Usuario no administrador',
    })
};