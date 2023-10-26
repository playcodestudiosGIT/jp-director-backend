const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos } = require('../middlewares');
const { 
    regaloEvent,
    registroEvent,
    clickEvent,
    ttkClickEvent,
    ttkRegisterEvent,
    ttkRegaloEvent,
    ttkServerEvent
 } = require('../helpers');


const router = Router();

router.post('/meta-regalo', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('phone', 'El Teléfono es obligatorio').not().isEmpty(),
    validarCampos
], regaloEvent);


router.post('/meta-registro', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('lastname', 'El apellido es obligatorio').not().isEmpty(),
    validarCampos
], registroEvent);

router.post('/meta-click', [
    check('title', 'La Fuente es obligatorio').not().isEmpty(),
    check('source', 'La Fuente es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatorio').not().isEmpty(),
    validarCampos
], clickEvent);

router.post('/ttk-click', [
    check('title', 'La Fuente es obligatorio').not().isEmpty(),
    check('source', 'La Fuente es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatorio').not().isEmpty(),
    validarCampos
], ttkClickEvent);

router.post('/ttk-registro', [
    check('title', 'La Fuente es obligatorio').not().isEmpty(),
    check('source', 'La Fuente es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatorio').not().isEmpty(),
    validarCampos
], ttkRegisterEvent);

router.post('/ttk-regalo', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('phone', 'El Teléfono es obligatorio').not().isEmpty(),
    validarCampos
], ttkRegaloEvent);

router.post('/ttk-login', [
    check('title', 'La Fuente es obligatorio').not().isEmpty(),
    check('source', 'La Fuente es obligatorio').not().isEmpty(),
    check('description', 'La descripcion es obligatorio').not().isEmpty(),
    validarCampos
], ttkServerEvent);




module.exports = router;