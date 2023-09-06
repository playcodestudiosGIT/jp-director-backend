const SibApiV3Sdk = require('sib-api-v3-sdk');









const sendEmailBrevo = async (nombre, apellido, correo, templateId, urlAction)  => {
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

  await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
  }, function (error) {
    console.log(`error ${error}`)
  });

}
const sendSupEmail = async (nombre, apellido, correo, mensaje)  => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  apiKey.apiKey = process.env.BREVO_API;

  sendSmtpEmail = {
    to: [{
      email: process.env.SUPPORT_EMAIL,
      name: 'Centro de Ayuda y Soporte'
    }],
    templateId: 7,
    params: {
      name: nombre,
      surname: apellido,
      correo: correo,
      mensaje12: mensaje
    },
    

    headers: {
      'api-key': process.env.BREVO_API,
      'Content-Type': 'application/json;', // This is important for sending attachments with
      'Accept': 'application/json;'
    }
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
  }, function (error) {
    console.log(`error ${error}`)
  });

}
const sendOneEmail = async (nombre, apellido, correo, mensaje)  => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  apiKey.apiKey = process.env.BREVO_API;

  sendSmtpEmail = {
    to: [{
      email: correo,
      name: `${nombre} ${apellido}`
    }],
    templateId: 8,
    params: {
      name: nombre,
      surname: apellido,
      correo: correo,
      mensaje12: mensaje
    },
    

    headers: {
      'api-key': process.env.BREVO_API,
      'Content-Type': 'application/json;', // This is important for sending attachments with
      'Accept': 'application/json;'
    }
  };

  await apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
  }, function (error) {
    console.log(`error ${error}`)
  });

}




const createContactBrevo = async (nombre, apellido, correo, telefono, listIds) => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  var createContact = new SibApiV3Sdk.CreateContact();
  var apiInstance = new SibApiV3Sdk.ContactsApi();
  apiKey.apiKey = process.env.BREVO_API;

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

  await apiInstance.createContact(createContact).then(function (data) {
    return 
  }, function (error) {
    const safa = JSON.parse(error["response"]["res"]["text"])
    // console.log('Crear contacto: ' + correo + ' ' +  safa["message"]);
  });

}


const agregarContactoALista = async (correo, listIds) => {

  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  var apiInstance = new SibApiV3Sdk.ContactsApi();
  apiKey.apiKey = process.env.BREVO_API;

  let listId = listIds;

  let contactEmails = new SibApiV3Sdk.AddContactToList();

  contactEmails.emails = [correo];

  await apiInstance.addContactToList(listId, contactEmails).then(function (data) {
    return;
  }, function (error) {
    const safa = JSON.parse(error["response"]["res"]["text"])
    // console.log('Listar: ' + correo + ' ' + safa["message"]);
  });

}

module.exports = {
  sendEmailBrevo,
  createContactBrevo,
  agregarContactoALista,
  sendSupEmail,
  sendOneEmail
}