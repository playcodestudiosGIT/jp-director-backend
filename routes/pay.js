
const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require('body-parser');

const {  } = require('../middlewares');

const { createSession } = require('../controllers/pay');

const endpointSecret = "whsec_xU3gzkqhK13n4Yfjx7zbnFeaK1pK7Q3v";
const stripe = require('stripe')(process.env.SECRET_KEY);
// /api/pay/ 


const router = Router();

router.post('/create-session', createSession);


// router.post('/check-success', secreStripeHook);


// router.post('/check-cancel', secreStripeHook);

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
    console.log('webhook');
    
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
      case 'checkout.session.async_payment_failed':
            const checkoutSessionAsyncPaymentFailed = event.data.object;
            console.log(checkoutSessionAsyncPaymentFailed);
        // Then define and call a function to handle the event checkout.session.async_payment_failed
        break;
      case 'checkout.session.async_payment_succeeded':
            const checkoutSessionAsyncPaymentSucceeded = event.data.object;
            console.log(checkoutSessionAsyncPaymentSucceeded);
        // Then define and call a function to handle the event checkout.session.async_payment_succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });
  

module.exports = router;