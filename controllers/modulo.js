const { response } = require('express');
const { Modulo, Curso, Coment, Resp, Progress, Usuario } = require('../models');
const progress = require('../models/progress');


const obtenerModulos = async (req, res = response) => {

    const { limite = 100, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, modulos] = await Promise.all([
        Modulo.countDocuments(query),
        Modulo.find(query)
            // .populate('usuario', 'nombre')
            // .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        modulos
    });
}

const obtenerModulo = async (req, res = response) => {

    const { id } = req.params;
    const modulo = await Modulo.findById(id)

    res.json(modulo);
}


const crearModulo = async (req, res = response) => {

    const { usuario, curso, ...body } = req.body;

    const cursoDB = await Curso.findById(curso);

    if (!cursoDB) {
        return res.status(400).json({
            msg: `El Curso ${curso}, no existe`
        });
    }

    const data = {
        ...body,
        curso: req.body.curso,
        usuario: req.usuario._id
    }

    const modulo = new Modulo(data);

    await modulo.save();

    cursoDB.modulos.push(modulo._id);

    await Curso.findByIdAndUpdate(curso, cursoDB, { new: true }); 

    await Usuario.updateMany({}, {$push: {progress: {
        moduloId: modulo._id,
        marker: 0,
        isComplete: false
    }}})

    res.status(201).json(modulo);

}

const actualizarModulo = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;


    data.usuario = req.usuario._id;

    const modulo = await Modulo.findByIdAndUpdate(id, data, { new: true });

    res.json(modulo);

}

const borrarModulo = async (req, res = response) => {

    const { id } = req.params;
    const moduloBorrado = await Modulo.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(moduloBorrado);
}


// -------------  COMENTARIOS ----------- //

const crearComentario = async (req, res = response) => {
    const usuario = req.usuario
    const { estado, cursoId, moduloId, ...body } = req.body;

    const moduloDB = await Modulo.findById(moduloId);

    if (!moduloDB) {
        return res.status(400).json({
            msg: `El Modulo ${moduloId}, no existe`
        });
    }

    const data = {
        usuario: usuario._id,
        comentario: body.comentario,
        curso: cursoId,
        modulo: body.modulo,
    }
    const comentario = new Coment(data);

    await comentario.save();
    moduloDB.coments.push(comentario._id);

    await Modulo.findByIdAndUpdate(moduloId, moduloDB, { new: true });

    res.status(201).json(comentario);

}

const crearRespuesta = async (req, res = response) => {
    const usuario = req.usuario
    const { ...resto } = req.body;
    const { id } = req.params
    const comentDB = await Coment.findById(id);

    if (!comentDB) {
        return res.status(400).json({
            msg: `El Comentario ${comentDB}, no existe`
        });
    }

    const data = {
        usuario: usuario._id,
        respuesta: resto.respuesta,
        estado: true,
        coment: id,
    }
    const resp = new Resp(data);

    comentDB.resp.push(resp._id);

    await resp.save();
    await Coment.findByIdAndUpdate(id, comentDB, { new: true });

    res.status(201).json(resp);

}

const obtenerRespuesta = async (req, res = response) => {

    const query = { estado: true };

    const [total, respuestas] = await Promise.all([
        Resp.countDocuments(query),
        Resp.find(query)

    ]);

    res.json({
        total,
        respuestas
    });
}

const crearProgress = async (req, res = response) => {

    const { moduloId, ...body } = req.body;
    const owner = req.usuario.id;
    const prog = await Progress.findOne({ owner: owner, moduloId: moduloId });

    if (prog) {
        const data = {
            ...body,
            owner: owner,
            moduloId: moduloId
        };

        const np = await Progress.findByIdAndUpdate(prog._id, data, { new: true })
        return res.status(201).json(np);
        };
    
    const data = {
        ...body,
        owner: owner,
        moduloId: moduloId
    };
    const newprog = new Progress(data);
    newprog.save();
    
    const user = await Usuario.findById(owner);
    
    user.progress.push(newprog);


    const nu = await Usuario.findByIdAndUpdate(user._id, user, {new: true})


    res.status(201).json(newprog);

}

const borrarComentario = async (req, res = response) => {
    const { id } = req.params
    const { moduloId } = req.body
    try {
        await Coment.findByIdAndUpdate(id, { estado: false }, { new: true });
        await Modulo.updateMany({ _id: moduloId }, {
            $pull: {
            coments: id
        }})
       
        res.json({ msg: 'Comentario borrada' });

        } catch (error) {
            res.json({ msg: error  });
        }
    }




module.exports = {
    crearModulo,
    obtenerModulos,
    obtenerModulo,
    actualizarModulo,
    borrarModulo,
    // ---- Comentarios --- //
    crearComentario,
    //-----------Progresos --------//
    crearProgress,
    //-----------Respuesta --------//
    obtenerRespuesta,
    crearRespuesta,
    borrarComentario
}