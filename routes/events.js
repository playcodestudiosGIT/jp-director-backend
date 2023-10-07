const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares');
const { regaloEvent, registroEvent, clickEvent } = require('../helpers');


// const { addEvent } = require('../controllers/events');


const router = Router();

router.post('/regalo',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('phone', 'El Teléfono es obligatorio').not().isEmpty(),
    validarCampos
], regaloEvent );


router.post('/registro',[
    check('email', 'El correo es obligatorio').isEmail(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    validarCampos
], registroEvent );


router.post('/click',[
    check('title', 'La Fuente es obligatorio').not().isEmpty(),
    check('source', 'La Fuente es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatorio').not().isEmpty(),
    validarCampos
], clickEvent );



module.exports = router;