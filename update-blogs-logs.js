const fs = require('fs');
const path = require('path');

// Actualizar el controlador blogs.js manualmente
const filePath = path.join(__dirname, 'controllers', 'blogs.js');
let content = fs.readFileSync(filePath, 'utf8');

// Ya hemos añadido la importación del logger
// Reemplazar los logs de solicitud
content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] GET \/api\/blogs - Obteniendo blogs con parámetros:`, req\.query\);/g, 
                         "logger.apiRequest('GET', '/api/blogs', req.query);");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] GET \/api\/blogs\/publicados - Obteniendo blogs publicados con parámetros:`, req\.query\);/g, 
                         "logger.apiRequest('GET', '/api/blogs/publicados', req.query);");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] GET \/api\/blogs\/:id - Obteniendo blog con ID: \${req\.params\.id}`\);/g, 
                         "logger.apiRequest('GET', `/api/blogs/${req.params.id}`, { id: req.params.id });");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] GET \/api\/blogs\/buscar - Buscando blogs con términos:`, req\.query\);/g, 
                         "logger.apiRequest('GET', '/api/blogs/buscar', req.query);");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] POST \/api\/blogs - Creando nuevo blog`, \{ titulo: req\.body\.tituloEs \}\);/g, 
                         "logger.apiRequest('POST', '/api/blogs', { titulo: req.body.tituloEs });");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] PUT \/api\/blogs\/:id - Actualizando blog con ID: \${req\.params\.id}`, \{ campos: Object\.keys\(req\.body\) \}\);/g, 
                         "logger.apiRequest('PUT', `/api/blogs/${req.params.id}`, { id: req.params.id, campos: Object.keys(req.body) });");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] DELETE \/api\/blogs\/:id - Eliminando blog con ID: \${req\.params\.id}`\);/g, 
                         "logger.apiRequest('DELETE', `/api/blogs/${req.params.id}`, { id: req.params.id });");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] GET \/api\/blogs\/disponibles\/:blogId - Obteniendo blogs disponibles para relacionar, excluyendo ID: \${req\.params\.blogId}`\);/g, 
                         "logger.apiRequest('GET', `/api/blogs/disponibles/${req.params.blogId}`, { blogId: req.params.blogId });");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] PUT \/api\/blogs\/:id\/relacionados - Actualizando artículos relacionados para blog con ID: \${req\.params\.id}`, \{ relacionados: req\.body\.relacionados \}\);/g, 
                         "logger.apiRequest('PUT', `/api/blogs/${req.params.id}/relacionados`, { id: req.params.id, relacionados: req.body.relacionados });");

content = content.replace(/console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] GET \/api\/blogs\/:id\/relacionados - Obteniendo artículos relacionados para blog con ID: \${req\.params\.id}`\);/g, 
                         "logger.apiRequest('GET', `/api/blogs/${req.params.id}/relacionados`, { id: req.params.id });");

// Reemplazar los logs de error
content = content.replace(/console\.log\(error\);(\s+)res\.status\(500\)\.json\(\{/g, 
                         "logger.apiError(req.method, req.originalUrl, error);$1res.status(500).json({");

fs.writeFileSync(filePath, content);
console.log('Actualizado: blogs.js');