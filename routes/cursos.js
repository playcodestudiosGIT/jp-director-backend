const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const { crearCurso,
    obtenerCursos,
    obtenerCurso,
    obtenerCursosUserId,
    obtenerCertificado,
    actualizarCurso,
    borrarCurso } = require('../controllers/cursos');
const { existeCursoPorId, existeUsuarioPorId, existeCertPorId } = require('../helpers/db-validators');

const router = Router();

/**
 * {{url}}/api/cursos
 */

router.get('/', obtenerCursos);

router.get('/cert/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    validarCampos,
    check('id').custom(existeCertPorId),
], obtenerCertificado);

router.get('/:id', [
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCursoPorId),
    validarCampos
], obtenerCurso);


router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('descripcion', 'El descripcion es obligatorio').not().isEmpty(),
    // check('usuario','El id es obligatorio').not().isEmpty(),
    validarCampos
], crearCurso);

router.put('/:id', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCursoPorId),
    validarCampos
], actualizarCurso);


router.delete('/:id', [
    validarJWT,
    check('id', 'No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCursoPorId),
    validarCampos,
], borrarCurso);



module.exports = router;