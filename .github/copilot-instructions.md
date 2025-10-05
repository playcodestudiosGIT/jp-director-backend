# JP Director Backend - Guía para Agentes de IA

## PRIORITARIO

Al detectar un problema o error:
1. Analiza y determina el origen del error
2. Explica brevemente el problema y su causa
3. Proporciona una recomendación concisa sobre cómo corregirlo
4. NUNCA EDITES CÓDIGO sin una petición explícita del usuario

Este es un backend REST para la plataforma JP Director, una plataforma de aprendizaje y blogs en línea con características multilingües (español/inglés).

## Arquitectura

- **Patrón MVC**: Modelo-Vista-Controlador con énfasis en API REST.
- **Base**: Node.js + Express + MongoDB (Mongoose)
- **Autenticación**: JWT (JSON Web Tokens) con validación middleware
- **Almacenamiento**: Cloudinary para archivos multimedia (imágenes, PDFs)

## Estructura del Proyecto

```
├── app.js                 # Punto de entrada de la aplicación
├── models/
│   ├── server.js          # Configuración principal del servidor Express
│   ├── blog.js, curso.js  # Definiciones de esquemas Mongoose
├── controllers/           # Lógica de negocio para cada entidad
├── routes/                # Definiciones de rutas API REST
├── middlewares/           # Funciones de intercepción (JWT, validación, etc.)
├── helpers/               # Utilidades reutilizables
├── database/              # Configuración de la conexión MongoDB
```

## Convenciones y Patrones Importantes

### 1. Manejo de Imágenes y Archivos

El sistema usa Cloudinary para almacenamiento de archivos. Cuando una imagen se actualiza:
- La imagen anterior se elimina de Cloudinary automáticamente
- Las imágenes se almacenan en carpetas específicas por tipo (avatars, blogs, etc.)

```javascript
// Ejemplo en controllers/uploads.js
if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
}
```

### 2. Multilingüismo

Los modelos de contenido (blogs, cursos) incluyen campos duplicados para soporte multilingüe:
- `tituloEs`/`tituloEn` - títulos en español/inglés
- `contenidoEs`/`contenidoEn` - contenidos en español/inglés

### 3. Relacionados (Blogs)

Los blogs tienen una característica de "artículos relacionados" que usa referencias cruzadas:
```javascript
relacionados: [{
    type: Schema.Types.ObjectId,
    ref: 'Blog'
}]
```

### 4. Control de Acceso

- Las rutas usan el middleware `validarJWT` para rutas protegidas
- `esAdminRole` verifica el rol de administrador para operaciones privilegiadas
- Se usa `express-validator` para validar datos de entrada

### 5. Logging

Los controladores incluyen logs detallados con formato consistente:
```javascript
console.log(`[${new Date().toISOString()}] GET /api/ruta - Descripción:`, parametros);
```

## Comandos Importantes

- **Iniciar en desarrollo**: `npm run dev` (con nodemon para recarga automática)
- **Iniciar en producción**: `npm start` (o `node app.js`)
- **Despliegue en Heroku**: Configurado mediante `Procfile` (web: node app.js)

## Dependencias Externas

- **Autenticación**: JWT para tokens de sesión
- **Almacenamiento**: Cloudinary para archivos
- **Email**: Brevo (SIB) para emails transaccionales
- **Pagos**: Stripe para procesamiento de pagos
- **Análisis**: Integración con Facebook Pixel y TikTok Pixel

## Rutas API

Las rutas siguen el patrón RESTful. Ejemplos:
- `GET /api/blogs` - Listado de blogs (con filtros)
- `POST /api/blogs` - Crear un blog (requiere admin)
- `GET /api/blogs/disponibles/:blogId` - Obtener blogs disponibles para relacionar
- `PUT /api/blogs/:id/relacionados` - Actualizar artículos relacionados

## Consideraciones Especiales

- Los IDs de MongoDB deben validarse con el formato adecuado (24 caracteres hexadecimales)
- Las imágenes se manejan con el campo `img` en lugar de `imagen` para consistencia entre entidades
- Los errores de validación se devuelven con un status 400 y un objeto con mensaje de error