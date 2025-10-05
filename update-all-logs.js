const fs = require('fs');
const path = require('path');

// Actualizar el controlador auth.js
const updateAuthController = () => {
  const filePath = path.join(__dirname, 'controllers', 'auth.js');
  let content = fs.readFileSync(filePath, 'utf8');

  // Añadir importación del logger
  if (!content.includes("const { logger }")) {
    content = content.replace(
      "const { googleVerify, serverEvent, ttkServerEvent } = require('../helpers');",
      "const { googleVerify, serverEvent, ttkServerEvent, logger } = require('../helpers');"
    );
  }

  // Reemplazar todos los console.log con logger
  content = content.replace(/console\.log\([^;]+;/g, (match) => {
    if (match.includes('error')) {
      return "logger.error('Error en autenticación', { error });";
    } else {
      return "logger.info('Operación de autenticación');";
    }
  });

  fs.writeFileSync(filePath, content);
  console.log('Actualizado: auth.js');
};

// Crear una lista de controladores a actualizar
const controllersToUpdate = [
  'usuarios.js',
  'cursos.js',
  'uploads.js',
  'forms.js',
  'leads.js',
  'modulo.js',
  'pay.js',
  'buscar.js'
];

// Actualizar los controladores restantes
const updateRemainingControllers = () => {
  controllersToUpdate.forEach(controllerFile => {
    const filePath = path.join(__dirname, 'controllers', controllerFile);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Añadir importación del logger
      if (!content.includes("const { logger }") && content.includes("const { response }")) {
        content = content.replace(
          "const { response } = require('express');",
          "const { response } = require('express');\nconst { logger } = require('../helpers');"
        );
      } else if (!content.includes("const { logger }")) {
        // Si no tiene la importación estándar, agregar al principio
        content = "const { logger } = require('../helpers');\n" + content;
      }
      
      // Reemplazar logs de error
      content = content.replace(/console\.log\(error\);(\s+)(res|return res)\.status\(\d+\)\.json\(\{/g, 
        "logger.apiError(req.method, req.originalUrl, error);$1$2.status(500).json({");
      
      // Reemplazar otros console.log
      content = content.replace(/console\.log\(`[^`]+`[^;]*\);/g, 
        "logger.info('API operation', { url: req.originalUrl, method: req.method });");
      
      content = content.replace(/console\.log\([^;]+;/g, 
        "logger.info('Operation', { url: req.originalUrl, method: req.method });");
      
      fs.writeFileSync(filePath, content);
      console.log(`Actualizado: ${controllerFile}`);
    } else {
      console.log(`No se encontró: ${controllerFile}`);
    }
  });
};

updateAuthController();
updateRemainingControllers();