const { Schema, model } = require('mongoose');

const RespSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario1',
        require: [true, 'el usuario es obligatorio'],
 
    },
    respuesta: {
        type: String,
        required: [true, 'El comentario es obligatorio'],
    },
    estado: {
        type: Boolean,
        default: true
    },

    coment: {
        type: String,
        require: true
    }
    
}, { timestamps: true });


RespSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}
module.exports = model( 'Resp', RespSchema );