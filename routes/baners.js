const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, esAdminRole, validarJWT } = require('../middlewares');

const { obtenerBaner, crearBaner, actualizarBaner, borrarBaner } = require('../controllers/baners');


const router = Router();

router.get('/', obtenerBaner);


router.post('/',[
    validarJWT,
    // check('priceId', 'La url de redirección es obligatorio').not().isEmpty(),
    // check('urlImage', 'La url de redirección es obligatorio').not().isEmpty(),
    esAdminRole,
    // check('id', 'No es un id de Mongo válido').isMongoId(),
    // check('id').custom(existeModuloPorId),
    //TODO VALIDACIONES
    validarCampos
], crearBaner);


router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    // check('id').custom( existeUsuarioPorId ),
    // check('rol').custom( esRoleValido ), 
    validarCampos
], actualizarBaner);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    // check('id').custom( existeUsuarioPorId ),
    // check('rol').custom( esRoleValido ), 
    validarCampos
], borrarBaner);


module.exports = router;