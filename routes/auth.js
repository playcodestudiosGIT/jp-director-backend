const { Router } = require('express');
const { check } = require('express-validator');


const { validarCampos, validarJWT } = require('../middlewares');


const { login, googleSignin, validarTokenUsuario, verifyUser, resetPass, sendResetPass } = require('../controllers/auth');


const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validarCampos
], googleSignin );


router.get('/',[
    validarJWT
], validarTokenUsuario);

router.post('/confirm/:confirmCode', verifyUser);

router.post('/sendresetpass/:email', sendResetPass);

router.post('/resetpass/:token', resetPass);



module.exports = router;