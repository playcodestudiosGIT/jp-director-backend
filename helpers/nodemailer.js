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



module.exports = {
  sendConfirmationEmail
}