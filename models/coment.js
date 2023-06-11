const { Schema, model } = require('mongoose');

const ComentSchema = Schema({
    usuario: {
        type: String,
        require: [true, 'el usuario es obligatorio'],
    },
    comentario: {
        type: String,
        required: [true, 'El comentario es obligatorio']
    },
    estado: {
        type: Boolean,
        default: true
    },
    curso: {
        type: Schema.Types.ObjectId,
        ref: 'Curso',
        require: true
    },
    modulo: {
        type: Schema.Types.ObjectId,
        ref: 'Modulo',
        require: true
    },

    resp: {
        type: [Schema.Types.ObjectId],
        ref: 'Resp',
        autopopulate: true
    }

    
    
}, { timestamps: true });

ComentSchema.plugin(require('mongoose-autopopulate'));

ComentSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...data } = this.toObject()
    return data;
}
module.exports = model( 'Coment', ComentSchema );