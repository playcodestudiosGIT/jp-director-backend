const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCurso,
    obtenerCursos,
    obtenerCurso,
    obtenerCursosUserId,
    actualizarCurso,
    borrarCurso } = require('../controllers/cursos');
const { existeCursoPorId, existeUsuarioPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/categorias
 */

//  Obtener todas las categorias - publico
router.get('/', obtenerCursos);

// router.get('/user/:id', [
//     check('id', 'No es un id de Mongo válido').isMongoId(),
//     check('id').custom(existeUsuarioPorId),
//     validarCampos
// ], obtenerCursosUserId);

// Obtener una categoria por id - publico
router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCursoPorId),
    validarCampos
], obtenerCurso);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('subtitle', 'El subtitulo es obligatorio').not().isEmpty(),
    check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
    // check('usuario','El id es obligatorio').not().isEmpty(),
    validarCampos
], crearCurso);

// Actualizar - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCursoPorId),
    validarCampos
], actualizarCurso);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCursoPorId),
    validarCampos,
], borrarCurso);



module.exports = router;