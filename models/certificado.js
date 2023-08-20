const { Schema, model } = require('mongoose');

const CertificadoSchema = Schema({

    cursoId: {
        type: String,
        require: [true, 'el ID del modulo es obligatorio']
    },
    usuarioId: {
        type: String,
        require: [true, 'el ID del usuario es obligatorio']
    },
    urlPdf: {
        type: String,
        default: ''
    },

}, { timestamps: true });


CertificadoSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Certificado', CertificadoSchema );