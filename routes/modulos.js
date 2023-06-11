const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearModulo,
    obtenerModulos,
    obtenerModulo,
    actualizarModulo,
    borrarModulo, 
    crearComentario,
    crearRespuesta,
    obtenerRespuesta} = require('../controllers/modulo');

const { existeCursoPorId, existeModuloPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerModulos);

// Obtener una categoria por id - publico
router.get('/:id', [
    // check('id', 'No es un id de Mongo válido').isMongoId(),
    // check('id').custom(existeModuloPorId),
    validarCampos,
], obtenerModulo);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    // check('curso').custom(existeCursoPorId),
    validarCampos
], crearModulo);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    // check('categoria','No es un id de Mongo').isMongoId(),
    // check('id').custom(existeModuloPorId),
    validarCampos
], actualizarModulo);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    // check('id', 'No es un id de Mongo válido').isMongoId(),
    // check('id').custom(existeModuloPorId),
    validarCampos,
], borrarModulo);


// -------------- COMENTARIOS ///// //

router.post('/coments/add', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    // check('curso').custom(existeCursoPorId),
    validarCampos
], crearComentario);

router.post('/resp/add/:id', [
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    // check('categoria', 'No es un id de Mongo').isMongoId(),
    // check('curso').custom(existeCursoPorId),
    validarCampos
], crearRespuesta);

router.get('/resp/all', obtenerRespuesta);


module.exports = router;