const { response } = require('express');


const { } = require('../models');

const stripe = require('stripe')(process.env.SECRET_KEY);



const createSession = async (req, res = response) => {
    
    try {
        console.log('create try')
        const { priceId } = req.body;
        console.log(priceId);
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                    
                },
            ],
            mode: 'payment',
            success_url: `${process.env.DOMAIN}/#/home`,
            cancel_url: `${process.env.DOMAIN}/#/?canceled=true`,
        });
        // console.log(session);
   
        res.status(200).json(
            {
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



module.exports = {
    createSession,
}
















