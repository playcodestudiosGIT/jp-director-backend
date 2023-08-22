const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { cargarArchivo, actualizarImagenCloudinary, genPdfCert } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();


router.post('/', validarArchivoSubir, cargarArchivo);
router.post( '/certificados/gen', genPdfCert );

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe de ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'baners'])),
    validarCampos
], actualizarImagenCloudinary)



module.exports = router;