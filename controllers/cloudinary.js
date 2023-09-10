// import cloudinary from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUDNAME,
//     api_key: process.env.CLOUDINARY_APIKEY,
//     api_secret: process.env.CLOUDINARY_APISECRET
// });

// exports.uploads = (file) => {
//     return new Promise(resolve => {
//         cloudinary.uploader.upload(file, (result) => {
//             resolve({ url: result.url, id: result.public_id })
//         }, { resource_type: "auto" })
//     })
// }

// const fs = require('fs');
// const path = require('path')
// const PDFDocument = require('pdfkit');
// const cloud = require('./cloudinary')

// const pdf = async (req, res) => {
//     try {
//         const filename = req.body.filename;
//         const pdfPath = path.join('data', 'pdf', filename + '.pdf')
//         const pdfDoc = new PDFDocument()
        
//         res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '" ')
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.setHeader('Content-Type', 'application/pdf')
//         res.status(201)
//         pdfDoc.pipe(fs.createWriteStream(pdfPath));
//         await pdfDoc.pipe(res);
//         const content = await req.body.content
//         pdfDoc.text(content)
        
//         cloud.uploads(pdfPath).then((result) => {
//           const pdfFile = {
//           pdfName: filename,
//           pdfUrl: result.url,
//           pdfId: result.id
//            }
//            console.log('pdf results--', pdfFile.pdfUrl)
//         })
//         pdfDoc.end();
//     }
//         catch (err) {
//             res.status(400).json({ message: 'An error occured in process' });
//         }
//     }



