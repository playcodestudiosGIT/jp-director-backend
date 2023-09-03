const path = require('path');
const fs = require('fs');
const pdf = require('html-pdf');

const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { Usuario, Baner, Curso, Certificado } = require('../models');


const cargarArchivo = async (req, res = response) => {


    try {

        // txt, md
        // const nombre = await subirArchivo( req.files, ['txt','md'], 'textos' );
        const nombre = await subirArchivo(req.files, undefined, 'imgs');
        res.json({ nombre });

    } catch (msg) {
        res.status(400).json({ msg });
    }

}


const actualizarImagen = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'baners':
            modelo = await Baner.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }


    // Limpiar imágenes previas
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen);
        }
    }


    const imgUrl = await subirArchivo(req.files, undefined, coleccion);
    modelo.img = imgUrl;

    await modelo.save();


    res.json(modelo);

}

/// USANDO ESte
const actualizarImagenCloudinary = async (req, res = response) => {

    const { id, coleccion } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`
                });
            }

            break;

        case 'baners':
            modelo = await Baner.findById(id);
            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`
                });
            }

            break;

        default:
            return res.status(500).json({ msg: 'Se me olvidó validar esto' });
    }

    // Limpiar imágenes previas
    if (modelo.img) {
        const nombreArr = modelo.img.split('/');
        const nombre = nombreArr[nombreArr.length - 1];
        const [public_id] = nombre.split('.');
        cloudinary.uploader.destroy(public_id);
    }


    //subir cloudinary
    const { tempFilePath } = req.files.archivo
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath, {folder: 'avatars'});
    modelo.img = secure_url;

    await modelo.save();

    res.json(secure_url);

}





const genPdfCert = async (req, res = response) => {

    const { userId, cursoId } = req.body

    const usuario = await Usuario.findById(userId);
    const curso = await Curso.findById(cursoId);

    var currentdate = new Date();

    var cert = new Certificado();
    cert.cursoId = curso.id;
    cert.usuarioId = usuario.id;


    var idCert = 'id-cert'

    await cert.save().then(cert => idCert = cert.id);

    

    const content = `<!DOCTYPE html>
<html>

<head>
<meta charset="utf-8">
<title>Certificado</title>
    <style>
        div.cert {
            margin-left: auto;
            margin-right: auto;
            width: 1200px;
            height: 910px;
            background-image: url('${curso.urlImgCert}');
            background-repeat: no-repeat;
            background-size: cover;
            font-family: 'Roboto';
            
            color: #3B5996;
        }
        h1.nombre {
            text-align: center;
            width: 1200px;
            margin-top: 195px;
            position: absolute;
            font-size: 55px;
            font-weight: 800;
        }
        h3.fecha {
            width: 1200px;
            text-align: center;
            position: absolute;
            font-size: 20px;
            color: white;
            font-weight: 400;
            margin-top: 750px;
        }
        h3.url {
            width: 1200px;
            text-align: center;
            position: absolute;
            font-size: 18px;
            color: white;
            font-weight: 400;
            margin-top: 813px;
        }
        h3.id {
            width: 1180px;
            text-align: right;
            position: absolute;
            font-size: 14px;
            color: #ffffff;
            font-weight: 400;
            margin-top: 880px;
            opacity: 0.4;
        }
    </style>
</head>

<body>
    <div class="cert">
        <h1 class="nombre"> ${usuario.nombre} ${usuario.apellido} </h1> 
        <h3 class="fecha"> Aprobado el: ${currentdate.getDate()}/${currentdate.getMonth() + 1}/${currentdate.getFullYear()} </h3>
        <h3 class="url"> https://jpdirector.net/#/certificados/${idCert} </h3>
        <h3 class="id"> ID: ${idCert} </h3>
    </div>
</body>

</html>`;

    try {
        var options = {
            height: "700px",        // allowed units: mm, cm, in, px
            width: "900px",
        }
        await pdf.create(content, options).toFile(`./uploads/certificados/${idCert}.pdf`, async function (err) {
            if (err) {
                console.log(err);
            } else {

                const { secure_url } = await cloudinary.uploader.upload(`./uploads/certificados/${idCert}.pdf`, {folder: 'certificados'});
                const cert = await Certificado.findByIdAndUpdate(idCert, { urlPdf: secure_url }, { new: true });
                await Usuario.findByIdAndUpdate(userId, {$push: {certificados: cert} }, { new: true });
                fs.unlink(`./uploads/certificados/${idCert}.pdf`, function (err) {
                    if (err) throw err;
                });
                return res.json({
                    message: 'Certificado generado correctamente',
                    cert
                });
            }
        });

    } catch (error) {
        console.log(error)
        throw error
    }
};

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    genPdfCert,
}