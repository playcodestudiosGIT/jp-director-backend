const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');
const { existeBlogPorId } = require('../helpers/db-validators');
const {
    obtenerBlogs,
    obtenerBlogsPublicados,
    obtenerBlog,
    buscarBlogs,
    crearBlog,
    actualizarBlog,
    borrarBlog,
    obtenerBlogsDisponibles,
    actualizarRelacionados,
    obtenerRelacionados
} = require('../controllers/blogs');

const router = Router();

/**
 * {{url}}/api/blogs
 */

// Rutas públicas
router.get('/', obtenerBlogs);
router.get('/published', obtenerBlogsPublicados);
router.get('/search', buscarBlogs);
router.get('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeBlogPorId),
    validarCampos
], obtenerBlog);

// Rutas protegidas
router.post('/', [
    validarJWT,
    esAdminRole,
    check('tituloEs', 'El título en español es obligatorio').not().isEmpty(),
    check('tituloEn', 'El título en inglés es obligatorio').not().isEmpty(),
    check('contenidoEs', 'El contenido en español es obligatorio').not().isEmpty(),
    check('contenidoEn', 'El contenido en inglés es obligatorio').not().isEmpty(),
    check('fechaPublicacion', 'La fecha de publicación es obligatoria').not().isEmpty(),
    validarCampos
], crearBlog);

router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeBlogPorId),
    validarCampos
], actualizarBlog);

router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeBlogPorId),
    validarCampos
], borrarBlog);

// Rutas para artículos relacionados
router.get('/disponibles/:blogId', [
    validarJWT,
    check('blogId', 'No es un ID válido').isMongoId(),
    validarCampos
], obtenerBlogsDisponibles);

router.put('/:id/relacionados', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeBlogPorId),
    validarCampos
], actualizarRelacionados);

router.get('/:id/relacionados', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeBlogPorId),
    validarCampos
], obtenerRelacionados);

module.exports = router;