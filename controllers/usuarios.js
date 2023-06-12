const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { sendConfirmationEmail } = require('../helpers/nodemailer');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers');

const getUsuarioPorId = async (req = request, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    await usuario
        .populate({
            path: 'cursos',
            populate: {
                path: 'modulos'
            }
        }).execPopulate();

    res.json(usuario);
}


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: 'Active' };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .populate('cursos')
            .skip(Number(desde))
            .limit(Number(limite))

    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol, ...resto } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol, ...resto });
    // Generar el JWT
    const token = await generarJWT(usuario.id);
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //ConfirmCode
    usuario.confirmCode = token
    // Guardar en BD
    await usuario.save();

    sendConfirmationEmail(nombre, correo, token);

    res.json({
        usuario,
        token,
        
    });
}

const agregarCurso = async (req, res = response) => {
    const { id } = req.params;
    const { cursoId } = req.body
    const user = await Usuario.findById(id);
    if (!user) {
        res.status(200).json({msg: 'no existe usuario'})
    }
    if (user.cursos.includes(cursoId)) {
        res.status(200).json({ msg: 'El curso ya está agregado' });
        return
    }
    user.cursos.push(cursoId);

    newUser = await Usuario.findByIdAndUpdate(id, user, { new: true });

    res.status(200).json(newUser);
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, confirmCode, rol, google, ...resto } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    if (rol) {
        if (usuario.rol == 'ADMIN_ROLE') {
            resto.rol = rol;
        }
        
        
    }

    

    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });
    
    res.json(usuario);
}

const removerCurso = async (req, res = response) => {

    const { id } = req.params;
    const { cursoId } = req.body;

    const usuario = await Usuario.findById(id);

    cursos = usuario.cursos.filter(curso => curso._id != cursoId);

    usuario.cursos = cursos;

    await Usuario.findByIdAndUpdate(id, usuario, {new: true})

    // await usuario
    //     .populate({
    //         path: 'cursos',
    //         populate: {
    //             path: 'modulos'
    //         }
    //     }).execPopulate();
    
    res.json(usuario);
}


const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }).populate('cursos');


    res.json(usuario);
}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    getUsuarioPorId,
    agregarCurso,
    removerCurso
}