const { response, request } = require('express');


const { Baner } = require('../models');




const obtenerBaner = async(req = request, res = response) => {


    const query = { estado: true };
    const  baners  = await Baner.find(query);
    res.json({baners});
}

const crearBaner = async (req, res = response) => {
    try {
        const { urlRedirect, urlImage, estado   } = req.body;

        // Generar la data a guardar
        const data = {
            urlRedirect: urlRedirect,
            urlImage: urlImage
        }
  
        const baner = new Baner(data);
    
        // Guardar DB
        await baner.save();

        res.status(201).json(baner);

    } catch (error) {
        res.status(400).json({
            msg: 'Error, Puede que el curso ya exista.'
        })
    }

}

const actualizarBaner = async(req, res = response) => {

    const { id } = req.params;
    const { estado, urlImage, urlRedirect } = req.body;
    
    console.log(req.params);
    console.log(id);

    const data = {
        urlRedirect: urlRedirect,
        urlImage: urlImage
    }

    console.log(data);
    const baner = await Baner.findByIdAndUpdate(id, data, {new: true});
    

    res.json({baner});
}


module.exports = {
    actualizarBaner,
    obtenerBaner,
    crearBaner
}