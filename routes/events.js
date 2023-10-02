const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT } = require('../middlewares');


const { addEvent } = require('../controllers/events');


const router = Router();

router.post('/add',[
    // check('correo', 'El correo es obligatorio').isEmail(),
    // check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], addEvent );



module.exports = router;