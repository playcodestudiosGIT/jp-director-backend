const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize, json } = format;
require('winston-daily-rotate-file');

// Formato personalizado para la consola
const consoleFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `[${timestamp}] ${level}: ${message}`;
  if (Object.keys(metadata).length > 0 && metadata.constructor === Object) {
    msg += ` ${JSON.stringify(metadata, null, 2)}`;
  }
  return msg;
});

// Configuración de rotación de archivos
const fileRotateTransport = new transports.DailyRotateFile({
  filename: 'logs/jp-director-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d', // Mantener logs de hasta 14 días
  maxSize: '20m',  // Rotar cuando el archivo alcance 20MB
  format: combine(
    timestamp(),
    json()
  )
});

// Crear el logger
const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  defaultMeta: { service: 'jp-director-api' },
  transports: [
    // Logs en consola con colores para desarrollo
    new transports.Console({
      format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        consoleFormat
      )
    }),
    // Logs en archivos con rotación
    fileRotateTransport
  ]
});

// Funciones helper para facilitar el registro de logs de API
logger.apiRequest = (method, url, params = {}) => {
  logger.info(`${method} ${url}`, { params });
};

logger.apiError = (method, url, error, params = {}) => {
  logger.error(`${method} ${url} - Error: ${error.message}`, { 
    error: error.stack, 
    params 
  });
};

module.exports = logger;