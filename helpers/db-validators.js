
const { Usuario, Curso, Modulo, Form, Role, Certificado } = require('../models');

const esRoleValido = async(rol = 'USER_ROLE') => {
    const existeRol = await Role.findOne({ rol: rol });
    if ( !existeRol ) {
        throw new Error(`El rol ${ rol } no está registrado en la BD`);
    }
}

const emailExiste = async( correo = '' ) => {

    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if ( existeEmail ) {
        throw new Error(`El correo: ${ correo }, ya está registrado`);
    }
}

const existeUsuarioPorId = async( id ) => {
    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);
    if ( !existeUsuario ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Cursos
 */
const existeCursoPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCurso = await Curso.findById(id);
    if ( !existeCurso ) {
        throw new Error(`El curso no existe ${ id }`);
    }
}
const existeCertPorId = async( id ) => {

    // Verificar si el correo existe
    const existeCert = await Certificado.findById(id);
    if ( !existeCert ) {
        throw new Error(`El curso no existe ${ id }`);
    }
}

//Forms 

const existeFormularioPorId = async( id ) => {

    // Verificar si el correo existe
    const existeForm = await Form.findById(id);
    if ( !existeForm ) {
        throw new Error(`El formulario no existe ${ id }`);
    }
}

/**
 * Productos
 */
const existeModuloPorId = async( id ) => {

    // Verificar si el correo existe
    const existeModulo = await Modulo.findById(id);
    if ( !existeModulo ) {
        throw new Error(`El id no existe ${ id }`);
    }
}

/**
 * Validar colecciones permitidas
 */
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if ( !incluida ) {
        throw new Error(`La colección ${ coleccion } no es permitida, ${ colecciones }`);
    }
    return true;
}


module.exports = {
    existeFormularioPorId,
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCursoPorId,
    existeModuloPorId,
    coleccionesPermitidas,
    existeCertPorId
}

