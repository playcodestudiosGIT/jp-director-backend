const { Schema, model } = require('mongoose');

const TestimonioSchema = Schema({

    nombre: {
        type: String,
        require: [true, 'el nombre es obligatorio']
    },
    img: {
        type: String,
        require: [true, 'La imagen de perfil es obligatoria']
    },
    testimonio: {
        type: String,
        default: ''
    },
    cursoId: {
        type: String,
        default: ''
    },
    estado: {
        type: Boolean,
        default : true
    }

}, { timestamps: true });


TestimonioSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Testimonio', TestimonioSchema );