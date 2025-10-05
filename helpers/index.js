

const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
const brevoServices = require('./brevo_services');
const pixelEvents = require('./pixel_events');
const logger = require('./logger');

module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...brevoServices,
    ...pixelEvents,
    logger
}