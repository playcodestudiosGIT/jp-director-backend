const { response, request } = require('express');


const { Baner } = require('../models');




const obtenerBaner = async(req = request, res = response) => {


    const query = { estado: true };
    const baners = await Baner.find(query);
    const total = await Baner.countDocuments()
    res.json({baners, total});
}

const crearBaner = async (req, res = response) => {
    try {
        const { cursoId, priceId, img, nombre   } = req.body;
        // Generar la data a guardar
        const data = {
            nombre: nombre,
            priceId: priceId,
            img: img,
            cursoId: cursoId
        }

        const baner = new Baner(data);
        // Guardar DB
        await baner.save();

        res.status(201).json(baner);

    } catch (error) {
        res.status(400).json({
            msg: 'Error, Puede que el curso ya exista.' + error
        })
    }

}

const actualizarBaner = async(req, res = response) => {

    const { id } = req.params;
    const { cursoId, priceId, nombre } = req.body;

    const data = {
        nombre: nombre,
        priceId: priceId,
        cursoId: cursoId,
    }

    const baner = await Baner.findByIdAndUpdate(id, data, {new: true});
    

    res.json(baner);
}

const borrarBaner = async (req, res = response) => {

    const { id } = req.params;
    const baner = await Baner.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        msg: 'curso Borrado',
        baner
    });
}



module.exports = {
    actualizarBaner,
    obtenerBaner,
    crearBaner,
    borrarBaner
}