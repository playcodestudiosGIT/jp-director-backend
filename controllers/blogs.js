const { response } = require('express');
const Blog = require('../models/blog');

// Obtener todos los blogs (con paginación)
const obtenerBlogs = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] GET /api/blogs - Obteniendo blogs con parámetros:`, req.query);
    try {
        const { limite = 10, desde = 0, estado, publicado } = req.query;
        const query = { estado: true }; // Por defecto, solo muestra blogs no eliminados
        
        // Si se especifica estado explícitamente, lo sobreescribimos
        if (estado !== undefined) {
            query.estado = estado === 'true';
        }
        
        // Si se especifica publicado, lo añadimos al query
        if (publicado !== undefined) {
            query.publicado = publicado === 'true';
        }

        const [total, blogs] = await Promise.all([
            Blog.countDocuments(query),
            Blog.find(query)
                .populate('usuario', 'nombre')
                .skip(Number(desde))
                .limit(Number(limite))
                .sort({ fechaPublicacion: -1 })
        ]);

        res.json({
            total,
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener blogs'
        });
    }
}

// Obtener blogs publicados
const obtenerBlogsPublicados = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] GET /api/blogs/publicados - Obteniendo blogs publicados con parámetros:`, req.query);
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const query = { 
            estado: true,
            publicado: true,
            fechaPublicacion: { $lte: new Date() }
        };

        const [total, blogs] = await Promise.all([
            Blog.countDocuments(query),
            Blog.find(query)
                .populate('usuario', 'nombre')
                .skip(skip)
                .limit(Number(limit))
                .sort({ fechaPublicacion: -1 })
        ]);

        res.json({
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener blogs publicados'
        });
    }
}

// Obtener blog por id
const obtenerBlog = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] GET /api/blogs/:id - Obteniendo blog con ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        
        // Verificar que el ID sea válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                msg: 'ID no válido'
            });
        }

        // Buscar el blog y populate el usuario y los relacionados
        const blog = await Blog.findById(id)
            .populate('usuario', 'nombre')
            .populate({
                path: 'relacionados',
                select: 'tituloEs tituloEn img fechaPublicacion',
                match: { estado: true, publicado: true }
            });

        // Verificar si el blog existe
        if (!blog || blog.estado === false) {
            return res.status(404).json({
                msg: `No existe un blog con el ID ${id}`
            });
        }
        
        // Filtrar cualquier relacionado que pueda ser null debido al match
        if (blog.relacionados) {
            blog.relacionados = blog.relacionados.filter(r => r !== null);
        }

        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener el blog'
        });
    }
}

// Buscar blogs
const buscarBlogs = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] GET /api/blogs/buscar - Buscando blogs con términos:`, req.query);
    try {
        const { q = '', page = 1, limit = 10 } = req.query;
        const regex = new RegExp(q, 'i');
        const skip = (Number(page) - 1) * Number(limit);

        const query = {
            $or: [
                { tituloEs: regex },
                { tituloEn: regex },
                { contenidoEs: regex },
                { contenidoEn: regex }
            ],
            estado: true,
            publicado: true
        };

        const [total, blogs] = await Promise.all([
            Blog.countDocuments(query),
            Blog.find(query)
                .populate('usuario', 'nombre')
                .skip(skip)
                .limit(Number(limit))
                .sort({ fechaPublicacion: -1 })
        ]);

        res.json({
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error en la búsqueda'
        });
    }
}

// Crear blog
const crearBlog = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] POST /api/blogs - Creando nuevo blog`, { titulo: req.body.tituloEs });
    try {
        const { estado, usuario, ...body } = req.body;

        const data = {
            ...body,
            usuario: req.usuario._id
        }

        const blog = new Blog(data);
        await blog.save();

        res.status(201).json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al crear el blog'
        });
    }
}

// Actualizar blog
const actualizarBlog = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] PUT /api/blogs/:id - Actualizando blog con ID: ${req.params.id}`, { campos: Object.keys(req.body) });
    try {
        const { id } = req.params;
        const { usuario, ...data } = req.body;

        // Verificamos que el blog exista
        const blogExistente = await Blog.findById(id);
        if (!blogExistente) {
            return res.status(404).json({
                msg: `No existe un blog con el ID ${id}`
            });
        }

        // Actualizamos los campos que vienen en la petición
        if (data.tituloEs) blogExistente.tituloEs = data.tituloEs;
        if (data.tituloEn) blogExistente.tituloEn = data.tituloEn;
        if (data.publicado !== undefined) blogExistente.publicado = data.publicado;
        if (data.estado !== undefined) blogExistente.estado = data.estado;
        if (data.contenidoEs) blogExistente.contenidoEs = data.contenidoEs;
        if (data.contenidoEn) blogExistente.contenidoEn = data.contenidoEn;
        if (data.imagen) blogExistente.img = data.imagen;
        if (data.img) blogExistente.img = data.img;
        if (data.fechaPublicacion) blogExistente.fechaPublicacion = data.fechaPublicacion;
        if (data.relacionados) blogExistente.relacionados = data.relacionados;
        
        // El usuario que actualiza queda registrado
        blogExistente.usuario = req.usuario._id;
        
        // Guardamos los cambios
        await blogExistente.save();

        res.json(blogExistente);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar el blog'
        });
    }
}

// Eliminar blog
const borrarBlog = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] DELETE /api/blogs/:id - Eliminando blog con ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        const blog = await Blog.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al eliminar el blog'
        });
    }
}

// Obtener blogs disponibles para relacionar (excluye el blog actual)
const obtenerBlogsDisponibles = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] GET /api/blogs/:id/disponibles - Obteniendo blogs disponibles para relacionar, excluyendo ID: ${req.params.id}`);
    try {
        const { blogId } = req.params;
        
        // Excluir el blog actual y mostrar solo blogs activos y publicados
        const blogs = await Blog.find({ 
            _id: { $ne: blogId },
            estado: true,
            publicado: true
        }).select('tituloEs tituloEn img fechaPublicacion');
        
        res.json({
            blogs
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener blogs disponibles para relacionar'
        });
    }
};

// Actualizar artículos relacionados de un blog
const actualizarRelacionados = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] PUT /api/blogs/:id/relacionados - Actualizando artículos relacionados para blog con ID: ${req.params.id}`, { relacionados: req.body.relacionados });
    try {
        const { id } = req.params;
        const { relacionados } = req.body;
        
        // Validar que los IDs son válidos
        if (relacionados && Array.isArray(relacionados)) {
            // Verificar que cada ID en relacionados es válido y existe
            for (const relacionadoId of relacionados) {
                if (!relacionadoId.match(/^[0-9a-fA-F]{24}$/)) {
                    return res.status(400).json({
                        msg: `ID no válido: ${relacionadoId}`
                    });
                }
                
                const relacionadoExiste = await Blog.exists({ 
                    _id: relacionadoId,
                    estado: true
                });
                
                if (!relacionadoExiste) {
                    return res.status(404).json({
                        msg: `No existe un blog con el ID ${relacionadoId}`
                    });
                }
            }
        }
        
        // Actualizar los relacionados
        const blog = await Blog.findByIdAndUpdate(
            id, 
            { relacionados: relacionados || [] }, 
            { new: true }
        ).populate('relacionados', 'tituloEs tituloEn img');
        
        if (!blog) {
            return res.status(404).json({
                msg: `No existe un blog con el ID ${id}`
            });
        }
        
        res.json(blog);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al actualizar los artículos relacionados'
        });
    }
};

// Obtener artículos relacionados de un blog
const obtenerRelacionados = async (req, res = response) => {
    console.log(`[${new Date().toISOString()}] GET /api/blogs/:id/relacionados - Obteniendo artículos relacionados para blog con ID: ${req.params.id}`);
    try {
        const { id } = req.params;
        
        const blog = await Blog.findById(id)
            .populate({
                path: 'relacionados',
                select: 'tituloEs tituloEn img fechaPublicacion',
                match: { estado: true, publicado: true }
            });
        
        if (!blog) {
            return res.status(404).json({
                msg: `No existe un blog con el ID ${id}`
            });
        }
        
        // Filtrar cualquier relacionado que pueda ser null debido al match
        const relacionados = blog.relacionados.filter(r => r !== null);
        
        res.json({
            relacionados
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al obtener los artículos relacionados'
        });
    }
};

module.exports = {
    obtenerBlogs,
    obtenerBlogsPublicados,
    obtenerBlog,
    buscarBlogs,
    crearBlog,
    actualizarBlog,
    borrarBlog,
    obtenerBlogsDisponibles,
    actualizarRelacionados,
    obtenerRelacionados
}