const { Schema, model } = require('mongoose');

const BlogSchema = Schema({
    tituloEs: {
        type: String,
        required: [true, 'El título en español es obligatorio']
    },
    tituloEn: {
        type: String,
        required: [true, 'El título en inglés es obligatorio']
    },
    contenidoEs: {
        type: String,
        required: [true, 'El contenido en español es obligatorio']
    },
    contenidoEn: {
        type: String,
        required: [true, 'El contenido en inglés es obligatorio']
    },
    img: {
        type: String,
        default: 'https://res.cloudinary.com/dqhj9cim6/image/upload/v1685068240/system/no-image_yvvpny.jpg'
    },
    estado: {
        type: Boolean,
        default: true
    },
    publicado: {
        type: Boolean,
        default: false
    },
    fechaPublicacion: {
        type: Date,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    relacionados: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }]
}, {
    timestamps: true // Esto añade automáticamente createdAt y updatedAt
});

// Método para limpiar la respuesta JSON
BlogSchema.methods.toJSON = function() {
    const { __v, ...blog } = this.toObject();
    return blog;
}

module.exports = model('Blog', BlogSchema);