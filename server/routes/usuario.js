const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificaToken, (req, res) => {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({estado: true})
            .skip(desde)
            .limit(limite)
            .exec((err, usuarios) => {
                
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Usuario.countDocuments({estado: true}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarios,
                        conteo
                    });
                })
            })

  });
  
app.post('/usuario', [verificaToken, verificaAdmin_Role], function (req, res) {
  
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
});
  
app.put('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {
  
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre','email','img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
});
  
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role], function (req, res) {

    let id = req.params.id;

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, {new: true}, (err, usuarioBorrado) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }


        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })

});

module.exports = app