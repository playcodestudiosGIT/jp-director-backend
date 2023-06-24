
const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
        default: 'https://res.cloudinary.com/dqhj9cim6/image/upload/v1685037402/system/noavatar_rltqwa.jpg'
    },
    telf: {
        type: String,
        default: 'no value'
    },
    me: {
        type: String,
        default: 'About me'
    },
    instagram: {
        type: String,
        default: 'instagram.com/'
    },
    facebook: {
        type: String,
        default: 'facebook.com/'
    },
    tiktok: {
        type: String,
        default: 'tiktok.com/'
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: false
    },
    google: {
        type: Boolean,
        default: false
    },
    
    confirmCode: {
        type: String,
        unique: true
    },

    cursos: {
        type: [String],
        default: [],
        autopopulate: true
        
    },
    progress: {
        type: [],
    },
},{timestamps: true});


UsuarioSchema.plugin(require('mongoose-autopopulate'));

UsuarioSchema.methods.toJSON = function() {
    const { __v, password, _id, ...usuario  } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

module.exports = model( 'Usuario', UsuarioSchema );
