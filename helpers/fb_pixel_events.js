const bizSdk = require('facebook-nodejs-business-sdk');
const { response, request } = require('express');

'use strict';
    const Content = bizSdk.Content;
    const CustomData = bizSdk.CustomData;
    const DeliveryCategory = bizSdk.DeliveryCategory;
    const EventRequest = bizSdk.EventRequest;
    const UserData = bizSdk.UserData;
    const ServerEvent = bizSdk.ServerEvent;

    const access_token = process.env.META_ACCES_TOKEN;
    const pixel_id = process.env.PIXEL_ID;
    const api = bizSdk.FacebookAdsApi.init(access_token);

    let current_timestamp = Math.floor(new Date() / 1000);


const regaloEvent = async (req, res = response) => {

    const { email, phone } = req.body;
    const eventSource = `Guía Regalo - ${email} - ${phone}`
    const userData = (new UserData())
        .setEmails([email])
        .setPhones([phone])
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(req.connection.remoteAddress)
        .setClientUserAgent(req.headers['user-agent'])
        .setFbp('fb.1.1558571054389.1098115397')
        .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const content = (new Content())
        .setId('RegaloDescarga')
        .description('Descarga Guia de regalo')

    const customData = (new CustomData())
        .setContents([content])
    const serverEvent = (new ServerEvent())
        .setEventName('RegaloDescarga')
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl(eventSource)
        .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = (new EventRequest(access_token, pixel_id))
        .setEvents(eventsData);

    eventRequest.execute().then(
        response => {
            // console.log('Response: ', response);
            res.json({
                msg: "Evento creado"
            })
        },
        err => {
            // console.error('Error: ', err);
            res.json({
                
                msg: "Algo salió mal",
                err: e
            })
        }
    );


}
const registroEvent = async (req, res = response) => {

    const { email, name, lastname } = req.body;

    const userData = (new UserData())
        .setEmails([email])
        .setLastName(name)
        .setLastName(lastname)
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(req.connection.remoteAddress)
        .setClientUserAgent(req.headers['user-agent'])
        .setFbp('fb.1.1558571054389.1098115397')
        .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const content = (new Content())
        .setId('RegistroEvent')
        .setCategory('Register')
        .setDescription('Alguna otra informacion relevante')

    const customData = (new CustomData())
        .setContents([content])
        // .setCurrency('usd')
        // .setValue(0.0);

    const serverEvent = (new ServerEvent())
        
        .setEventName('RegistroEvent')
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl('/user/register - Nuevo JpDirector')
        .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = (new EventRequest(access_token, pixel_id))
        .setEvents(eventsData);

    eventRequest.execute().then(
        response => {
            // console.log('Response: ', response);
            res.json({
                msg: "Evento creado"
            })
        },
        err => {
            console.error('Error: ', err);
            res.json({
                
                msg: "Algo salió mal",
                // err: err
            })
        }
    );


}

const serverEvent = async ( action, firstname, lastname, email, description, remoteAddress, userAgent, res = response) => {
    const userData = (new UserData())
        .setFirstName(firstname)
        .setLastName(lastname)
        .setEmail(email)
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(remoteAddress)
        .setClientUserAgent(userAgent)
        // .setClientIpAddress(req.connection.remoteAddress)
        // .setClientUserAgent(req.headers['user-agent'])
        .setFbp('fb.1.1558571054389.1098115397')
        .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const content = (new Content())
        .setId(action)
        .setCategory('ServerEvent')
        .setTitle('Usuario inicio sesion')
        .setDescription(description)

    const customData = (new CustomData())
        .setContents([content])
        
        // .setCurrency('usd')
        // .setValue(0.0);

    const serverEvent = (new ServerEvent())
        
        .setEventName('ServerEvents')
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl('Server Actions')
        .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = (new EventRequest(access_token, pixel_id))
        .setEvents(eventsData);

    eventRequest.execute()
    
    // .then(
    //     response => {
    //         console.log('Evento Creado ');
    //     },
    //     err => {
    //         console.error('Error: ', err);
    //     }
    // );
}

const clickEvent = async (req, res = response) => {

    const {title, source, description, email = 'noemail@jpdirector.net'  } = req.body;

    const userData = (new UserData())
        .setEmail(email)
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(req.connection.remoteAddress)
        .setClientUserAgent(req.headers['user-agent'])
        .setFbp('fb.1.1558571054389.1098115397')
        .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const content = (new Content())
        .setId('ClickEvents')
        .setCategory('Event')
        .setTitle(title)
        .setDescription(description)

    const customData = (new CustomData())
        .setContents([content])
        
        // .setCurrency('usd')
        // .setValue(0.0);

    const serverEvent = (new ServerEvent())
        
        .setEventName('ClickEvents')
        .setEventTime(current_timestamp)
        .setUserData(userData)
        .setCustomData(customData)
        .setEventSourceUrl(source)
        .setActionSource('website');

    const eventsData = [serverEvent];
    const eventRequest = (new EventRequest(access_token, pixel_id))
        .setEvents(eventsData);

    eventRequest.execute().then(
        response => {
            // console.log('Response: ', response);
            res.json({
                msg: "Evento creado"
            })
        },
        err => {
            console.error('Error: ', err);
            res.json({
                
                msg: "Algo salió mal",
                // err: err
            })
        }
    );


}


module.exports = {
    clickEvent,
    regaloEvent,
    registroEvent,
    serverEvent
}


