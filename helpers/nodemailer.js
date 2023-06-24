const nodemailer = require("nodemailer");


const user = process.env.USER_MAILER;
const pass = process.env.PASS_MAILER;

const transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  service: "Gmail",
  secure: true,
  auth: {
    user: user,
    pass: pass,
  },
});

const sendConfirmationEmail = ( nombre, correo, confirmCode ) => {

  return new Promise( async (resolve, reject) => {
      
      
    const info = await transport.sendMail({
      form: user,
      to: correo,
      subject: 'Por favor, confirma tu cuenta en JP Director',
      html:`<h1>Email de Confirmación</h1>
      <h2>Hola ${nombre}</h2>
      <p>Gracias por suscribirte. Por favor confirma tu cuenta haciendo click en el siguiente enlace.</p>
      <a target="_self" href=https://jpdirector.herokuapp.com/#/auth/verify/${confirmCode}> Click here</a>
      </div>`,

    }).catch(err => console.log(err));
    
    console.log(info.messageId);
  });

}

const sendForgotPassEmail = ( nombre, correo, token ) => {

  return new Promise( async (resolve, reject) => {

    const info = await transport.sendMail({
      form: user,
      to: correo,
      subject: 'Resetea tu clave',
      html:`<h1>Cambio de clave</h1>
      <p>Hola ${nombre}. Podras cambiar tu clave en el siguiente enlace.</p>
      <a target="_self" href=https://jpdirector.herokuapp.com/#/auth/newpass/${token}>Cambia tu contraseña</a>
      </div>`,

    }).catch(err => console.log(err));
    
    console.log(info.messageId);
  });

}


const sendEmailGift = ( correo ) => {

  return new Promise( async (resolve, reject) => {
      
      console.log('sendGiftEmail');
    const info = await transport.sendMail({
      form: user,
      to: correo,
      subject: 'Descarga tu regalo',
      html:`<h1>Ya puedes descargar tu regalo</h1>
      <p>Podras descargar tu regalo en el siguiente enlace.</p>
      <a target="_self" href=https://drive.google.com/uc?export=download&id=1X3-E_xPYIMWY3iDwHQeWz3tkYyWU3A3I>Descargar</a>
      </div>`,

    }).catch(err => console.log(err));
    
    console.log(info.messageId);
  });

}



module.exports = {
  sendConfirmationEmail,
  sendForgotPassEmail,
  sendEmailGift
}