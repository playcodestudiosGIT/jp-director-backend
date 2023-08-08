const { response } = require('express');
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/generar-jwt');
const { sendEmailBrevo } = require('../helpers/brevo_services');
const { googleVerify } = require('../helpers/google-verify');


const login = async(req, res = response) => {

    const { correo, password } = req.body;

    try {
      
        // Verificar si el email existe
        const usuario = await Usuario.findOne({ correo })
        .populate({
            path : 'cursos',
            populate : {
              path : 'modulos'
            }
          })

        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // SI el usuario está pendiente
        if ( !usuario.estado == 'Pending') {
            return res.status(400).json({
                msg: 'Usuario por confirmar, revise su correo'
            });
        }
        // SI el usuario está inactivo
        if ( !usuario.estado == 'Disable') {
            return res.status(400).json({
                msg: 'Usuario desactivado, contácte con soporte'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);
        res.json({
            usuario,
            token
        })

    } catch (error) {

        res.status(500).json({
            msg: 'Hable con el administrador'
        });
    }   

}


const googleSignin = async(req, res = response) => {

    const { id_token } = req.body;
    
    try {
        const { correo, nombre, img } = await googleVerify( id_token );

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en DB
        if ( !usuario.estado ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es válido'
        })

    }



}

const validarTokenUsuario = async (req, res = response ) => {
    const usuario = req.usuario
    // Generar el JWT
    const token = await generarJWT(req.usuario._id);

    res.json({
        usuario,
        token: token,
    })

}

const verifyUser = async (req, res = response) => {

    const { confirmCode } = req.params;
    try {
        const usuario = await Usuario.findOne({confirmCode: confirmCode})
        if (!usuario) {
            return res.status(400).json({ msg: 'No Existe ese usuario' });
        }
        await Usuario.findOneAndUpdate({ confirmCode: confirmCode }, { estado: true }, {new: true});
        res.status(200).json({msg: 'ok'});
    } catch (error) {
        res.status(400).json({
            msg: `error ${error}`
        })
    }


}

const resetPass = async (req, res = response) => {

    const { newPass } = req.body;
    const { token } = req.params;

    try {
        const usuario = await Usuario.findOne({confirmCode: token})
        if (!usuario) {
            return res.status(400).json({ msg: 'No Existe ese usuario' });
        }
        const salt = bcryptjs.genSaltSync();
        usuario.password = bcryptjs.hashSync(newPass, salt);

        usuario.save()
        res.status(200).json({msg: 'ok'});
    } catch (error) {
        res.status(400).json({
            msg: `error ${error}`
        })
    }


}

const sendResetPass = async (req, res = response) => {

    const { email } = req.params;
    console.log(email);
    try {
        const usuario = await Usuario.findOne({ correo: email });
        if (!usuario) {
            return res.status(400).json({ msg: 'No Existe ese usuario' });
        }
        const token = await generarJWT(usuario._id);
        usuario.confirmCode = token
        usuario.save();
        console.log(usuario.nombre);
        console.log(usuario.apellido);
        console.log(email);
        sendEmailBrevo(usuario.nombre, usuario.apellido, email, 4, `http://localhost:61856/#/auth/newpass/${usuario.confirmCode}`)
      
        
        res.status(200).json({msg: 'ok'});
    } catch (error) {
        res.status(400).json({
            msg: `error ${error}`
        })
    }


}



module.exports = {
    login,
    googleSignin,
    validarTokenUsuario,
    verifyUser,
    resetPass,
    sendResetPass
}
