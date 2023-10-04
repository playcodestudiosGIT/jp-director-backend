
const { Router } = require('express');
const { check } = require('express-validator');


const {  } = require('../middlewares');

const { createSession, getSession } = require('../controllers/pay');

const router = Router();

router.post('/create-session', createSession);
router.post('/getsession', getSession);

module.exports = router;