const { response } = require('express');
const axios = require('axios');
const { logger } = require('../helpers');

const downloadPDF = async (req, res = response) => {
    const pdfUrl = 'https://blog.jpdirector.net/wp-content/uploads/2025/11/5-Prompts-de-IA-Meta-Ads.pdf';
    try {
        const response = await axios({
            url: pdfUrl,
            method: 'GET',
            responseType: 'stream'
        });

        // Configurar headers para forzar la descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="5-Prompts-de-IA-Meta-Ads.pdf"');
        
        // Transmitir el PDF al cliente
        response.data.pipe(res);
        
        logger.info('PDF descargado exitosamente');
    } catch (error) {
        logger.error('Error al descargar PDF', { error });
        res.status(500).json({
            msg: 'Error al descargar el archivo'
        });
    }
};

module.exports = {
    downloadPDF
};