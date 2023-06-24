const { Schema, model } = require('mongoose');

const CursoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    subtitle: {
        type: String,
        default: 'subtitle',
        unique: false
    },
    descripcion: {
        type: String,
        default: 'descripcion',
        unique: false
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    modulos: {
        type: [Schema.Types.ObjectId],
        ref: 'Modulo',
        autopopulate: true
        
    },
    img: {
        type: String,
        default: 'https://res.cloudinary.com/dqhj9cim6/image/upload/v1685068240/system/no-image_yvvpny.jpg',
    },
    duracion: {
        type: String,
        default: '0',
    },
    usuario: {
        type: String,
        required: true
    }
}, { timestamps: true });

CursoSchema.plugin(require('mongoose-autopopulate'));

CursoSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}


module.exports = model( 'Curso', CursoSchema );
