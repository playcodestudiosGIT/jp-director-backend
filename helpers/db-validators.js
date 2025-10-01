
const { Usuario, Curso, Modulo, Form, Role, Certificado, Testimonio, Blog } = require('../models');

const esRoleValido = async(rol = 'USER_ROLE') => {
    const existeRol = await Role.findOne({ rol: rol });
    if ( !existeRol ) {
        console.log(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        console.log(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        console.log(`El id no existe ${ id }`);
    }
}

/**
 * Cursos
 */
const existeCursoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCurso = await Curso.findById(id);
    if ( !existeCurso ) {
        console.log(`El curso no existe ${ id }`);
    }
}
//Certif
const existeCertPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCert = await Certificado.findById(id);
    if ( !existeCert ) {
        console.log(`El curso no existe ${ id }`);
    }
}
//testimonio
const existeTestimonioById = async( id ) => {

    // Verificar si el correo existe
    const existe = await Testimonio.findById(id);
    if ( !existe ) {
        console.log(`El testimonio no existe ${ id }`);
    }
}

//Forms 

const existeFormularioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeForm = await Form.findById(id);
    if ( !existeForm ) {
        console.log(`El formulario no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeModuloPorId = async( id ) => {

    // Verificar si el correo existe
    const existeModulo = await Modulo.findById(id);
    if ( !existeModulo ) {
        console.log(`El id no existe ${ id }`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        console.log(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}


const existeBlogPorId = async( id ) => {
    const existeBlog = await Blog.findById(id);
    if ( !existeBlog ) {
        throw new Error(`El blog con id ${id} no existe`);
    }
}

module.exports = {
    existeFormularioPorId,
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCursoPorId,
    existeModuloPorId,
    coleccionesPermitidas,
    existeCertPorId,
    existeTestimonioById,
    existeBlogPorId
}

