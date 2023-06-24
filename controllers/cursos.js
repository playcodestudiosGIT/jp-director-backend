const { response } = require('express');
const { Curso, Usuario } = require('../models');


const obtenerCursos = async (req, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };
    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);
    res.json({
        total,
        cursos
    });
}

const obtenerCurso = async (req, res = response) => {
    const { id } = req.params;
    const curso = await Curso.findById(id);
    res.json(curso);
}

const crearCurso = async (req, res = response) => {
    try {
        const { usuario, ...resto } = req.body;
        const data = {
            usuario: req.usuario._id,
            ...resto
        }
        const curso = new Curso(data);
        await curso.save();
        res.status(201).json(curso);
    } catch (error) {
        res.status(400).json({
            msg: 'Error, Puede que el curso ya exista.'
        })
    }
}

const actualizarCurso = async (req, res = response) => {
    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;
    data.usuario = req.usuario._id;
    const curso = await Curso.findByIdAndUpdate(id, data, { new: true });
    res.json(curso);
}

const borrarCurso = async (req, res = response) => {
    const { id } = req.params;
    const curso = await Curso.findByIdAndUpdate(id, { estado: false }, { new: true });
    res.json({
        msg: 'curso Borrado',
        curso
    });
}




module.exports = {
    crearCurso,
    obtenerCursos,
    obtenerCurso,
    actualizarCurso,
    borrarCurso,
    // obtenerCursosUserId
}