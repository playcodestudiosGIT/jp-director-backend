const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares');

const { obtenerLeads, crearLead, actualizarLead, deleteLead } = require('../controllers/leads');


const router = Router();

router.get('/', obtenerLeads);


router.post('/',[
    check('email', 'El email es obligatorio').not().isEmpty(),
    validarCampos
], crearLead);


router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], actualizarLead);

router.delete('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos
], deleteLead );


module.exports = router;