const { response, request } = require('express');


const { Lead } = require('../models');
const { sendEmailBrevo, createContactBrevo } = require('../helpers/brevo_services');




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
        const {email, telf} = req.body;

        // Generar la data a guardar
        const data = {
            email: email,
            telf: telf
        }
  
        const lead = new Lead(data);
    
        // Guardar DB
        await lead.save();

        sendEmailBrevo('noname', 'nosurname', email, 5, `https://drive.google.com/uc?export=download&id=1X3-E_xPYIMWY3iDwHQeWz3tkYyWU3A3I`);
        createContactBrevo(email, 'nosurname', email, telf, [3]);


        res.status(201).json(lead);

    } catch (error) {
        res.status(400).json({
            msg: 'error crear lead'
        })
    }

}


const actualizarLead = async(req, res = response) => {

    const { id } = req.params;
    const { email, telf } = req.body;

    const lead = await Lead.findByIdAndUpdate( id, {email: email, telf: telf}, {new: true} );

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