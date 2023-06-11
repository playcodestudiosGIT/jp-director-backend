const { Schema, model } = require('mongoose');

const FormSchema = Schema({
    rootform: {
        type: String,
        require: [true, 'el Nombre del Formulario es obligatorio'],
        unique: false
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: false
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: false
    },
    phone: {
        type: String,
        required: [true, 'El telefono es obligatorio'],
        unique: false
    },
    business: {
        type: String,
        default: '',
        unique: false
    },
    operationyears: {
        type: String,
        default: '',
        unique: false
    },
    advertisingbefore: {
        type: Boolean,
        default: false,
        unique: false
    },
    facebookurl: {
        type: String,
        default: '',
        unique: false
    },
    instagramurl: {
        type: String,
        default: '',
        unique: false
    },
    advertisinglevel: {
        type: String,
        default: '',
        unique: false
    },
    onlineconference: {
        type: Boolean,
        default: false,
        unique: false
    },
    estado: {
        type: Boolean,
        default: true,
    },
    agree: {
        type: String,
        default: '',
    },
}, { timestamps: true });

FormSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...data } = this.toObject();
    data.uid = _id
    return data;
}
module.exports = model( 'Form', FormSchema );