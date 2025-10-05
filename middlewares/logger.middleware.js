const expressWinston = require('express-winston');
const { format, transports } = require('winston');

const requestLogger = expressWinston.logger({
  transports: [
    new transports.Console()
  ],
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(info => `[${info.timestamp}] HTTP ${info.meta.req.method} ${info.meta.req.url} ${info.meta.res.statusCode} - ${info.meta.responseTime}ms`)
  ),
  meta: true,
  expressFormat: false,
  colorize: true
});

module.exports = { requestLogger };