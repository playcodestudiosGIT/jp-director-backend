const SibApiV3Sdk = require('sib-api-v3-sdk');









const sendEmailBrevo = (nombre, apellido, correo, templateId, urlAction) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  apiKey.apiKey = process.env.BREVO_API;

  sendSmtpEmail = {
    to: [{
      email: correo,
      name: nombre
    }],
    templateId: templateId,
    params: {
      name: nombre,
      surname: apellido,
      url: urlAction
    },
    contact: {
      EMAIL: correo
    },

    headers: {
      'api-key': process.env.BREVO_API,
      'Content-Type': 'application/json;', // This is important for sending attachments with
      'Accept': 'application/json;'
    }
  };

  apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
    console.log('API called successfully. Returned data: ' + data);
  }, function (error) {
    console.error(error);
  });

}




const createContactBrevo = (nombre, apellido, correo, telefono, listIds) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  var createContact = new SibApiV3Sdk.CreateContact();
  var apiInstance = new SibApiV3Sdk.ContactsApi();
  apiKey.apiKey = process.env.BREVO_API;
  
  createContact.email = correo;
  createContact.email = correo;
  createContact.attributes = {
    "NOMBRE": nombre,
    "APELLIDOS": apellido,
    "SMS": telefono,
  }

  createContact.listIds = listIds
  
  createContact.headers = {
    'api-key': process.env.BREVO_API,
    'Content-Type': 'application/json;', // This is important for sending attachments with
    'Accept': 'application/json;'
  }

  apiInstance.createContact(createContact).then(function(data) {
    console.log('API called successfully. Returned data: ' + JSON.stringify(data));
  }, function(error) {
    console.log("contacto existe - Brevo");
  });

}





module.exports = {
  sendEmailBrevo,
  createContactBrevo
}