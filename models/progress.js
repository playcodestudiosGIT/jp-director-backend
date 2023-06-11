const { Schema, model } = require('mongoose');

const ProgressSchema = Schema({
    modulo: {
        type: Schema.Types.ObjectId,
        ref: 'Modulo',
        require: [true, 'el modulo es obligatorio']
    },
    Comment: {
        type: String,
        required: [true, 'El comentario es obligatorio']
    }
}, { timestamps: true });


ProgressSchema.methods.toJSON = function() {
    const { __v, _id, ...data } = this.toObject();
    data.uid = _id
    return data;
}

module.exports = model( 'Progress', ProgressSchema );