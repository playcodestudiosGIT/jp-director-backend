
const { Router } = require('express');
const { check } = require('express-validator');
const bodyParser = require('body-parser');

const {  } = require('../middlewares');

const { createSession, getSession } = require('../controllers/pay');
const endpointSecret = "whsec_be823010cad2fad02c9b84517900e445f3e48b343995b3f16fc62fdb1e145c2d";

// const endpointSecret = "whsec_xU3gzkqhK13n4Yfjx7zbnFeaK1pK7Q3v";
const stripe = require('stripe')(process.env.SECRET_KEY);
// /api/pay/ 


const router = Router();

router.post('/create-session', createSession);
router.post('/getsession', getSession);


// router.post('/check-success', secreStripeHook);


// router.post('/check-cancel', secreStripeHook);

router.post('/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];
  console.log(request.body)
  let event;
  
  // try {
  //   event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret, () => {
      
  //   });
  // } catch (err) {
  //   response.status(400).send(`Webhook Error: ${err.message}`);
  //   return;
  // }
  // console.log(request.body);
  // console.log(event);
  // Handle the event
  // switch (event.type) {
  //   case 'payment_intent.succeeded':
  //     const paymentIntentSucceeded = event.data.object;
  //     console.log(`DATA OBJECT -----${event.data.object}`)
  //     // Then define and call a function to handle the event payment_intent.succeeded
  //     break;
  //   // ... handle other event types
  //   default:
  //     console.log(`Unhandled event type ${event.type}`);
  // }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});
  

module.exports = router;