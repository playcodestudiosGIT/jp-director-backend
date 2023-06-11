



const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeFormularioPorId } = require('../helpers/db-validators');

const { crearFormulario, obtenerFormulario, obtenerFormularios, borrarFormulario, actualizarFormulario } = require('../controllers/forms')




const router = Router();



router.get('/', obtenerFormularios);

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeFormularioPorId),
    validarCampos
], obtenerFormulario);

router.post('/', [
    // validarJWT,
    check('rootform', 'El nombre del formulario es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('phone', 'El telefono es obligatorio').not().isEmpty(),
    check('business', 'El tipo de business es obligatorio').not().isEmpty(),
    check('operationyears', 'Los Años de operaciones son obligatorio').not().isEmpty(),
    check('advertisingbefore', 'Los advertisingbefore son obligatorio').not().isEmpty(),
    check('facebookurl', 'Los facebookurl son obligatorio').not().isEmpty(),
    check('instagramurl', 'Los instagramurl son obligatorio').not().isEmpty(),
    check('advertisinglevel', 'Los advertisinglevel son obligatorio').not().isEmpty(),
    check('onlineconference', 'Los onlineconference son obligatorio').not().isEmpty(),
    check('agree', 'Los agree son obligatorio').not().isEmpty(),
    validarCampos
], crearFormulario);

router.put('/:id', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('id').custom(existeFormPorId),
    validarCampos
], actualizarFormulario);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    // check('id', 'No es un id de Mongo válido').isMongoId(),
    // check('id').custom(existeCursoPorId),
    validarCampos,
], borrarFormulario);


module.exports = router;