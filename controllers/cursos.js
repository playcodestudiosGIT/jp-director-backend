const { response } = require('express');
const { Curso } = require('../models');


const obtenerCursos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, cursos] = await Promise.all([
        Curso.countDocuments(query),
        Curso.find(query)
            // .populate('modulos')
            .skip(Number(desde))
            .limit(Number(limite))

    ]);

    

    res.json({
        total,
        cursos
    });
}

const obtenerCursosUserId = async (req, res = response) => {
    const { id } = req.params;
    

    const usuario = await Usuario.findById(id);

    // await usuario.populate('modulos')

    res.json(
        usuario
    );
}

const obtenerCurso = async (req, res = response) => {

    const { id } = req.params;
    const curso = await Curso.findById(id);

    // await curso
    //     .populate({
    //         path: 'modulos',
    //         populate: {
    //             path: 'coments'
    //         }
    //     }).execPopulate();

    res.json(curso);

}

const crearCurso = async (req, res = response) => {

    try {

        const { usuario, ...resto } = req.body;



        // Generar la data a guardar
        const data = {
            usuario: req.usuario._id,
            ...resto
        }

        const curso = new Curso(data);

        // Guardar DB
        await curso.save();

        // await curso
        //     .populate('modulos')
        //     .execPopulate();

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

    // await curso
    //         .populate('modulos')
    //         .execPopulate();

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
    obtenerCursosUserId
}