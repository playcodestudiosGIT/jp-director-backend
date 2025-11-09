const { Router } = require('express');
const { downloadPDF } = require('../controllers/downloads');

const router = Router();

router.get('/pdf/:filename', downloadPDF);

module.exports = router;