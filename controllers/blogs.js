const { response } = require('express');
const Blog = require('../models/blog');

// Obtener todos los blogs (con paginación)
const obtenerBlogs = async (req, res = response) => {
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
    try {
        const { id } = req.params;
        
        // Verificar que el ID sea válido
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({
                msg: 'ID no válido'
            });
        }

        // Buscar el blog y populate el usuario
        const blog = await Blog.findById(id)
            .populate('usuario', 'nombre');

        // Verificar si el blog existe
        if (!blog || blog.estado === false) {
            return res.status(404).json({
                msg: `No existe un blog con el ID ${id}`
            });
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
        if (data.imagen) blogExistente.imagen = data.imagen;
        if (data.fechaPublicacion) blogExistente.fechaPublicacion = data.fechaPublicacion;
        
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

module.exports = {
    obtenerBlogs,
    obtenerBlogsPublicados,
    obtenerBlog,
    buscarBlogs,
    crearBlog,
    actualizarBlog,
    borrarBlog
}