

const dbValidators = require('./db-validators');
const generarJWT   = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivo = require('./subir-archivo');
const brevoServices = require('./brevo_services');
const metaEvents = require('./fb_pixel_events');


module.exports = {
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...subirArchivo,
    ...brevoServices,
    ...metaEvents
}