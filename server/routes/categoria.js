const express = require('express');

const _ = require('underscore');

let {verificaToken, verificaAdmin_Role} = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');


//
// Mostrar todas las categorias
//
app.get('/categoria', (req, res) => {
    Categoria.find({})
                .sort('descripcion')
                .populate('usuario','nombre email')
                .exec((err, categorias) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
                    Categoria.countDocuments({}, (err, conteo) => {
                        res.json({
                            ok: true,
                            categorias,
                            conteo
                        });
                    })
                });
});

//
// Mostrar una categoria por ID
//
app.get('/categoria/:id', (req, res) => {
    
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró la categoria'
                }
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    })
});

//
// Crear una nueva categoria
//
app.post('/categoria', verificaToken, (req, res) => {
    //Regresa la nueva categoria
    //req.usuario._id
    let body = req.body;
    console.log(req.usuario._id);
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//
// Actualiza la descripcion de una categoria
//
app.put('/categoria/:id',verificaToken, (req, res) => {
    
    let body = _.pick(req.body, ['descripcion']);
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, body, {new: true}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok:false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//
// Elimina una categoria fisicamente
//
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //Solo usuarios administradores pueden borrar las categorias
    //Borrado fisico
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            })
        }
        res.json({
            ok: true,
            categoriaBorrada
        });
    });
});

module.exports = app;