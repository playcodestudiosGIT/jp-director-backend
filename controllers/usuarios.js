const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const { sendConfirmationEmail, sendEmailGift, agregarContactoALista} = require('../helpers/brevo_services');

const { Usuario, Modulo } = require('../models');
const { generarJWT, sendEmailBrevo, createContactBrevo } = require('../helpers');
const progress = require('../models/progress');

const getUsuarioPorId = async (req = request, res = response) => {

    const { id } = req.params;

    const usuario = await Usuario.findById(id);

    res.json(usuario);
}


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = {};

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

    const { nombre, apellido, correo, password, rol, ...resto } = req.body;
    const usuario = new Usuario({ nombre, apellido, correo, password, rol, ...resto });
    // Generar el JWT
    const token = await generarJWT(usuario.id);
    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //ConfirmCode
    usuario.confirmCode = token

    const modulos = await Modulo.find({});

    const newProgress = [];

    for (var i in modulos) {

        const dataDumy = {
            moduloId: `${modulos[i]._id}`,
            marker: 0,
            isComplete: false
        }
        newProgress.push(dataDumy);

    }

    usuario.progress = newProgress;
    // Guardar en BD
    await usuario.save();
    
    sendEmailBrevo(nombre, apellido, correo, 1, `https://jpdirector.herokuapp.com/#/auth/verify/${token}`);
    await createContactBrevo(nombre, apellido, correo, '', [2]);
    await agregarContactoALista(correo, 4);
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
        return res.status(200).json({ msg: 'no existe usuario' })
    }
    if (user.cursos.includes(cursoId)) {
        return res.status(200).json({ msg: 'El curso esta repetido' });

    }
    user.cursos.push(cursoId);

    newUser = await Usuario.findByIdAndUpdate(id, user, { new: true });

    res.status(200).json(newUser);
}

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, estado, confirmCode, rol, google, ...resto } = req.body;
    if (password) {
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    if (rol) {
        if (usuario.rol == 'ADMIN_ROLE') {
            resto.rol = rol;
        }
    }

    if (estado) {
        resto.estado = estado
    }



    const usuario = await Usuario.findByIdAndUpdate(id, resto, { new: true });

    res.json(usuario);
}

const usuariosPutProgress = async (req, res = response) => {
    const { id } = req.params;
    const { moduloId, marker, isComplete } = req.body;
    
    try {
        const usuario = await Usuario.findById(id);

        const progresses = usuario.progress

    for (var i in progresses) {
        if (progresses[i].moduloId == moduloId) {
            if (progresses[i].isComplete) {
                progresses[i] = {
                    "moduloId": moduloId,
                    "marker": parseInt(marker),
                    "isComplete": false
                };
            } else {
                progresses[i] = {
                    "moduloId": moduloId,
                    "marker": parseInt(marker),
                    "isComplete": true
                };
            }
            
        }
    }
    
        const user = await Usuario.findByIdAndUpdate(id, { progress: progresses }, { new: true });


        res.json(user);

    } catch (error) {
        console.log(error);
    }

}

const removerCurso = async (req, res = response) => {

    const { id } = req.params;
    const { cursoId } = req.body;

    const usuario = await Usuario.findById(id);

    let cursos = usuario.cursos.filter(curso => curso != cursoId);

    usuario.cursos = cursos;


    usuario.save();

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


const downloadGift = async (req, res = response) => {

    const { email } = req.body;
    try {

        sendEmailGift(email);
        res.status(200).json({
            msg: `correo enviado a ${email}`
        })
    } catch (error) {
        res.status(400).json({
            msg: `error ${error}`
        })
    }

    console.log(`Correo Regalo Enviado a ${email}`)

}




module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
    getUsuarioPorId,
    agregarCurso,
    removerCurso,
    downloadGift,
    usuariosPutProgress
}