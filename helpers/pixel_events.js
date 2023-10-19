
const bizSdk = require('facebook-nodejs-business-sdk');
const { response } = require('express');
const axios = require('axios');
const util = require('util')



'use strict';
const Content = bizSdk.Content;
const CustomData = bizSdk.CustomData;
const DeliveryCategory = bizSdk.DeliveryCategory;
const EventRequest = bizSdk.EventRequest;
const UserData = bizSdk.UserData;
const ServerEvent = bizSdk.ServerEvent;

const access_token = process.env.META_ACCES_TOKEN;

const api = bizSdk.FacebookAdsApi.init(access_token);
const pixel_id = process.env.PIXEL_ID;

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
            console.log('Response: ', response);
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

const serverEvent = async (action, firstname, lastname, email, description, remoteAddress, userAgent, res = response) => {
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
    bizSdk.FacebookAdsApi.init(access_token);
    const { title, source, description, email = 'noemail@jpdirector.net', phone = '' } = req.body;
    const userData = (new UserData())
        .setEmail(email)
        .setPhone(phone)
        // It is recommended to send Client IP and User Agent for Conversions API Events.
        .setClientIpAddress(req.connection.remoteAddress)
        .setClientUserAgent(req.headers['user-agent'])
        .setFbp('fb.1.1558571054389.1098115397')
        .setFbc('fb.1.1554763741205.AbCdEfGhIjKlMnOpQrStUvWxYz1234567890');

    const content = (new Content())
        .setId('ClickEvents')
        .setCategory('Event')
        .setTitle(title)
        .setDescription(description);

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

    eventRequest.execute()
        .then(
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

const ttkClickEvent = async (req, res = response) => {
    const { source, hashId, hashPhone, hashEmail, description, title  } = req.body;

    const instance = axios.create({
        baseURL: 'https://business-api.tiktok.com/open_api/v1.3/pixel/',
        timeout: 1000,
        headers: {'Access-Token': process.env.TIKTOK_TOKEN}
      });

    const data = {
        "pixel_code": process.env.TIKTOK_PIXEL_ID,
        "event": "ClickEvent",
        "context": {
        //   "ad": {
        //     "callback": "<tiktok_click_id>"
        //   },
          "page": {
            "url": source
          },
          "user": {
            "external_id": hashId,
            "phone_number": hashPhone,
            "email": hashEmail
          },
          "user_agent": req.headers['user-agent'],
          "ip": req.connection.remoteAddress
        },
        "properties": {
          "contents": [{
            "content_id": title,
            "content_type": description, 
            "content_name": title
          }]
        },
      }

    try {
        await instance.post('track/', data);
        res.json({
            msg: "Evento creado"
        });
    } catch (error) {
        res.json({
            msg: "Algo salió mal"
        });
    }
}



module.exports = {
    clickEvent,
    regaloEvent,
    registroEvent,
    serverEvent,
    ttkClickEvent
}


