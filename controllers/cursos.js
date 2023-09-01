const { response } = require('express');
const { Curso, Certificado, Testimonio } = require('../models');


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

const obtenerCertificado = async (req, res = response) => {
    const { id } = req.params;
    const cert = await Certificado.findById(id);
    res.json({
        cert
    });
}

const obtenerTestimonio = async (req, res = response) => {
    const { id } = req.params;
    const testimonio = await Testimonio.findById(id);
    res.json({
        testimonio
    });
}


const agregarTestimonio = async (req, res = response) => {
    const { id } = req.params;
    const { nombre, img, testimonio, estado } = req.body;

    const data = {
        nombre,
        img,
        testimonio,
        estado,
        cursoId: id
    }

    var testimonioId = ''

    try {
        const testimonio = new Testimonio(data);
        await testimonio.save().then(testimonio => testimonioId = testimonio.id);

        await Curso.findByIdAndUpdate(id, {$push: { "testimonios": testimonioId }}, {new: true});
        res.status(201).json(testimonio);
    } catch (error) {
        res.status(400).json({
            msg: 'Error al crear testimonio.'
        })
    }
}

const borrarTestimonio = async (req, res = response) => {
    const { id } = req.params;
    const testimonio = await Testimonio.findByIdAndUpdate(id, { estado: false }, { new: true });
    await Curso.findByIdAndUpdate(testimonio.cursoId, { $pull: { "testimonios": id } });
    
    res.json({
        msg: 'Testiomonio Borrado',
    });
}

const actualizarTestimonio = async (req, res = response) => {
    const { id } = req.params;
    const { estado, ...data } = req.body;
    const testimonio = await Testimonio.findByIdAndUpdate(id, data, { new: true });
    res.json(testimonio);
}




module.exports = {
    crearCurso,
    obtenerCursos,
    obtenerCurso,
    actualizarCurso,
    borrarCurso,
    obtenerCertificado,
    agregarTestimonio,
    borrarTestimonio,
    actualizarTestimonio,
    obtenerTestimonio
    // obtenerCursosUserId
}