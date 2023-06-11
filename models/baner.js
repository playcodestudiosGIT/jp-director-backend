const { Schema, model } = require('mongoose');

const BanerSchema = Schema({
    urlRedirect: {
        type: String,
        required: [true, 'La url es requerida'],
        unique: false
    },

    urlImage: {
        type: String,
        default: 'https://res.cloudinary.com/dqhj9cim6/image/upload/v1685068240/system/no-image_yvvpny.jpg',
        unique: false
    },

    estado: {
        type: Boolean,
        default: true,
    }

}, { timestamps: true });


BanerSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...data } = this.toObject();
    data.uid = _id
    return data;
}


module.exports = model( 'Baner', BanerSchema );
