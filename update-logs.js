const fs = require('fs');
const path = require('path');

const controllersPath = path.join(__dirname, 'controllers');
const files = fs.readdirSync(controllersPath);

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(controllersPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reemplazar las importaciones
    if (!content.includes("const { logger } = require('../helpers')")) {
      content = content.replace(
        /const { response } = require\('express'\);/,
        "const { response } = require('express');\nconst { logger } = require('../helpers');"
      );
    }
    
    // Reemplazar los logs de error
    content = content.replace(
      /console\.log\(error\);(\s+)res\.status\(500\)\.json\(\{(\s+)msg: ['"](.+?)['"]/g,
      "logger.apiError(req.method, req.originalUrl, error);$1res.status(500).json({$2msg: '$3'"
    );
    
    // Reemplazar los logs de solicitud
    content = content.replace(
      /console\.log\(`\[\${new Date\(\)\.toISOString\(\)}\] (\w+) ([^`]+)`([^;]*));/g,
      "logger.apiRequest('$1', '$2'$3);"
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`Actualizado: ${file}`);
  }
});