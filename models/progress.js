const { Schema, model } = require('mongoose');

const ProgressSchema = Schema({

    moduloId: {
        type: String,
        require: [true, 'el ID del modulo es obligatorio']
    },
    marker: {
        type: Number,
        default: 0
    },
    isComplete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


ProgressSchema.methods.toJSON = function() {
    const { __v, ...data } = this.toObject();
    return data;
}

module.exports = model( 'Progress', ProgressSchema );