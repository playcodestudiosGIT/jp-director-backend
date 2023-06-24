const { Schema, model } = require('mongoose');

const BanerSchema = Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre del Baner es requerido']
    },

    priceId: {
        type: String,
        required: [true, 'El id del precio es requerido'],
        unique: false
    },

    img: {
        type: String,
        default: 'https://res.cloudinary.com/dqhj9cim6/image/upload/v1685068240/system/no-image_yvvpny.jpg',
    },

    cursoId: {
        type: String,
        default: '',
    },

    estado: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });


BanerSchema.methods.toJSON = function() {
    const { __v, estado, ...data } = this.toObject();
    return data;
}


module.exports = model( 'Baner', BanerSchema );
