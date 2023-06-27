const { response } = require('express');


const { Usuario, Curso } = require('../models');

const stripe = require('stripe')(process.env.SECRET_KEY);



const createSession = async (req, res = response) => {

    try {
        
        const {
            price,
            cursoId,
            userEmail,
        } = req.body;
        const curso = await Curso.findById(cursoId)
        if(curso == null) return res.status(400).json({msg: 'El cursoId es invalido'})

        const session = await stripe.checkout.sessions.create({
            line_items: [{
                name: curso.name,
                description: curso.description,
                price_data: {
                  currency: 'usd',
                  unit_amount: price,
                  product_data: {
                    name: curso.nombre,
                    description: curso.id,
                    images: [curso.img],
                  },
                },
                quantity: 1,
              }],
            
            mode: 'payment',
            customer_email: userEmail,
            success_url: `${process.env.DOMAIN}/#/checkout/checksession?cursoId=${cursoId}`,
            cancel_url: `${process.env.DOMAIN}/#/?canceled=true`,
        });
        console.log(session);

        const usuario = await Usuario.findOne({ correo: userEmail }, { sessionId: session.id }, { new: true });
        console.log(usuario);
        res.status(200).json(
            {   
                ok: true,
                url: session.url,
                sessionId: session.id
            }
        );

    } catch (error) {
        res.status(400).json({

            msg: `error ${error}`
        })
    }
};


const getSession = async (req, res = response) => {
    const { sessionId } = req.body;
    try {
        const session = await stripe.checkout.sessions.retrieve(
            sessionId);
        
            console.log(session['payment_status'])
        res.status(200).json({
            paymentStatus :  session["payment_status"],
        });
    } catch (error) {
        res.status(400).json({

            msg: `error ${error}`
        })
    }
}



module.exports = {
    createSession,
    getSession
}
















