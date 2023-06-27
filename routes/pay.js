
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


  

module.exports = router;