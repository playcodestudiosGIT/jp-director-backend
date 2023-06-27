const { response } = require('express');
const { Form } = require('../models');


const obtenerFormularios = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, formularios] = await Promise.all([
        Form.countDocuments(query),
        Form.find(query)
            .skip(Number(desde))
            .limit(Number(limite))

    ]);

    

    res.json({
        total,
        formularios
    });
}

const obtenerFormulario = async (req, res = response) => {

    const { id } = req.params;
    const form = await Form.findById(id)

    res.json(form);

}

const crearFormulario = async (req, res = response) => {
    try {

        const data = req.body;

        const form = new Form(data);

        // Guardar DB
        await form.save();

        res.status(201).json(form);

    } catch (error) {
        res.status(400).json({
            
            msg: 'Error, Puede que el formulario ya exista.'
        })
    }

}

const actualizarFormulario = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    data.usuario = req.usuario._id;

    const form = await Form.findByIdAndUpdate(id, data, { new: true });

    res.json(form);

}

const borrarFormulario = async (req, res = response) => {

    const { id } = req.params;
    const formBorrado = await Form.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(formBorrado);
}




module.exports = {
    crearFormulario,
    obtenerFormularios,
    obtenerFormulario,
    borrarFormulario,
    actualizarFormulario

}