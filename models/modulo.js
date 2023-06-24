const { Schema, model } = require('mongoose');

const ModuloSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    estado: {
        type: Boolean,
        default: true,
    },
    coments: {
        type: [Schema.Types.ObjectId],
        ref: 'Coment',
        default: [],
        autopopulate: true
    },
    usuario: {
        type: String,
        required: true
    },
    curso: {
        type: String,
        required: true,
        unique: false
    },
    descripcion: {
        type: String, default: ''
    },
    disponible: {
        type: Boolean, defult: true
    },
    img: {
        type: String, default: 'https://res.cloudinary.com/dqhj9cim6/image/upload/v1685068240/system/no-image_yvvpny.jpg'
    },
    video: {
        type: String, default: 'https://flutter.github.io/assets-for-api-docs/assets/videos/butterfly.mp4'
    },
    descarga: {
        type: String, default: ''
    },
    
}, { timestamps: true });

ModuloSchema.plugin(require('mongoose-autopopulate'));

ModuloSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    
    return data;
}


module.exports = model( 'Modulo', ModuloSchema );
