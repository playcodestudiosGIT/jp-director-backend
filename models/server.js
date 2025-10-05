const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;

        this.paths = {
            auth:       '/api/auth',
            usuarios:   '/api/usuarios',
            cursos: '/api/cursos',
            forms: '/api/forms',
            pay: '/api/pay',
            modulos:  '/api/modulos',
            uploads:    '/api/uploads',
            leads:    '/api/leads',
            events:     '/api/events',
            blogs:     '/api/blogs',
        }


        // Conectar a base de datos
        this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Logger de solicitudes HTTP
        const { requestLogger } = require('../middlewares/logger.middleware');
        this.app.use( requestLogger );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.cursos, require('../routes/cursos'));
        this.app.use( this.paths.modulos, require('../routes/modulos'));
        this.app.use( this.paths.forms, require('../routes/forms'));
        this.app.use( this.paths.pay, require('../routes/pay'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        this.app.use( this.paths.leads, require('../routes/leads'));
        this.app.use( this.paths.events, require('../routes/events'));
        this.app.use( this.paths.blogs, require('../routes/blogs'));
        
    }

    listen() {
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
