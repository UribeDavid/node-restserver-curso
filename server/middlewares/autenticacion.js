const jwt = require('jsonwebtoken');

//=======================
//   Verificar Token
//=======================

let verificaToken = (req, res, next) => {

    let authorization = req.get('authorization');

    jwt.verify(authorization, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            })
        }

        req.usuario = decoded.usuario;
        next();
    });
}

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Role invalido'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdmin_Role
}