
const { Router } = require('express');
const { check } = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole,
} = require('../middlewares');


const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

const { usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete,
    usuariosPutProgress,
    getUsuarioPorId,
    agregarCurso,
    removerCurso,
    sendSupportEmail, sendIndividualEmail } = require('../controllers/usuarios');

const router = Router();


router.get('/',[validarJWT], usuariosGet);

router.get('/:id', [
    validarJWT,
    // esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], getUsuarioPorId);

router.put('/:id', [
    validarJWT,
    // esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    // validarCampos
], usuariosPut);

router.put('/prog/:id', [
    validarJWT,

    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPutProgress);

router.put('/add/:id', [
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    // check('id').custom( existeUsuarioPorId ),
    // check('rol').custom(esRoleValido),
    check('cursoId', 'CursoId no es valido'),
    validarCampos
], agregarCurso);

router.put('/remove/:id', [
    validarJWT,
    // esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    // check('id').custom( existeUsuarioPorId ),
    // check('rol').custom(esRoleValido),
    check('cursoId', 'CursoId no es valido'),
    validarCampos
], removerCurso);

router.post('/', [
    // validarJWT,
    // esAdminRole,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),
    validarCampos
], usuariosPost);

router.delete('/:id', [
    
    validarJWT,
    esAdminRole,
    // esAdminRole,
    tieneRole('ADMIN_ROLE', 'VENTAR_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);


router.get('/:id', [
    validarJWT,
    // esAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], getUsuarioPorId);

router.post('/support', sendSupportEmail);
router.post('/contact-email', [
    validarJWT,
    esAdminRole
], sendIndividualEmail);

// router.patch('/', usuariosPatch);





module.exports = router;