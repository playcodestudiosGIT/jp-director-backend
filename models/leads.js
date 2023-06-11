const { Schema, model } = require('mongoose');

const LeadSchema = Schema({
    email: {
        type: String,
        required: [true, 'el email es requerida'],
        unique: false
    },
    estado: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });


LeadSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...data } = this.toObject();
    data.uid = _id
    return data;
}


module.exports = model( 'Lead', LeadSchema );
