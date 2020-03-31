const express = require('express');

const _ = require('underscore');

let { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

//
// Obtener todos los productos
//
app.get('/producto', verificaToken, (req, res) => {
    // Traer todos los productos
    // Populate: Usuario, Categoria
    // Paginar: Por páginas
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible: true})
                .skip(desde)
                .limit(limite)
                .sort('nombre')
                .populate('usuario', 'nombre email')
                .populate('categoria', 'descripcion')
                .exec((err, productos) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                    Producto.countDocuments({disponible: true}, (err, conteo) => {
                        res.json({
                            ok: true,
                            productos,
                            conteo
                        });
                    });
                });
});

//
// Obtener un objeto por ID
//
app.get('/producto/:id', verificaToken, (req, res) => {
    // Populate: Usuario, Categoria
    let id = req.params.id;

    Producto.findById(id)
            .populate('usuario','nombre, email')
            .populate('categoria', 'descripcion')
            .exec((err, productoDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                if (!productoDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'No se encontró el producto'
                        }
                    });
                }
                res.json({
                    ok: true,
                    productoDB
                });
            });
});

//
// Buscar productos
//
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productos
            });
        });
});

//
// Crear un nuevo producto
//
app.post('/producto', verificaToken, (req, res) => {
    // Guardar el Usuario
    // Guardar la Categoria
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUnidad: body.precioUnidad,
        descripcion: body.descripcion,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});

//
// Actualizar el producto
//
app.put('/producto/:id', verificaToken, (req, res) => {

        let body = _.pick(req.body, ['nombre','precioUnidad','descripcion','categoria', 'disponible']);

        let id = req.params.id;

        Producto.findByIdAndUpdate(id, body, {new: true}, (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                   ok: false,
                   err 
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No se encontró el producto'
                    }
                });
            }
            res.json({
                ok: true,
                productoDB
            });
        });
});

//
// Borrar un producto logicamente
//
app.delete('/producto/:id', verificaToken, (req, res) => {
    // Cambiar estado
    let cambiarEstado = {
        disponible: false
    }

    let id = req.params.id;

    Producto.findByIdAndUpdate(id, cambiarEstado, {new: true}, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontró el producto'
                }
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    });
});

module.exports = app;