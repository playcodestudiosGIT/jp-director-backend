const { response, request } = require('express');


const { Lead } = require('../models');




const obtenerLeads = async(req = request, res = response) => {


    const query = { estado: true };
    try {
        const  leads  = await Lead.find(query);
        res.json({leads});
        
    } catch (error) {
        res.status(400).json({
            msg: 'error obteniendo leads'
        })
        
    }
    
}

const crearLead = async (req, res = response) => {
    try {
        const {email} = req.body;

        // Generar la data a guardar
        const data = {
            email: email
        }
  
        const lead = new Lead(data);
    
        // Guardar DB
        await lead.save();

        res.status(201).json(lead);

    } catch (error) {
        res.status(400).json({
            msg: 'error crear lead'
        })
    }

}


const actualizarLead = async(req, res = response) => {

    const { id } = req.params;
    const { email } = req.body;

    const lead = await Lead.findByIdAndUpdate( id, {email: email}, {new: true} );

    res.json(lead);
}



const deleteLead = async(req, res = response) => {
    const { id } = req.params;
    const lead = await Lead.findByIdAndUpdate( id, { estado: false }, {new: true} );
    
    res.json(lead);
}


module.exports = {
    obtenerLeads,
    crearLead,
    actualizarLead,
    deleteLead
}