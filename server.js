'use strict';
require('dotenv').config();
//Définition des modules
const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cloudinary = require('cloudinary')
const formData = require('express-form-data')
const path = require("path");

let startup = null
if(process.env.NODE_ENV === 'dev') {
  console.log('dev environment')
  startup = require('./startup/startup');
} 

cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
})

//On définit notre objet express nommé app
const app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

//Connexion à la base de donnée
mongoose.set('debug', false);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/db', { useNewUrlParser: true }).then(() => {
    console.log('Connected to mongoDB');
    if(process.env.NODE_ENV === 'dev') {
      startup.run(mongoose.connection.db); //A décommenter pour initialiser la base de données
    } 
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

//Body Parser
var urlencodedParser = bodyParser.urlencoded({
    extended: true
});
app.use(urlencodedParser);
app.use(bodyParser.json());
app.use(formData.parse());
app.use(express.static(path.join(__dirname, "client", "build")))
app.use(cors());

//Définition des CORS
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//Définition du routeur
var router = express.Router();
app.enable("strict routing")
app.use('/user', router);
app.use('/events', router);
app.use('/translate', router);
app.use('/article', router);
app.use('/langues', router);
app.use('/roles', router);
app.use('/images', router);
app.use('/themes', router);
app.use('/traduction', router);
app.use('/dispositifs', router);
app.use('/channels', router);
require(__dirname + '/controllers/userController')(router);
require(__dirname + '/controllers/eventsController')(router);
require(__dirname + '/controllers/translateController')(router);
require(__dirname + '/controllers/articleController')(router);
require(__dirname + '/controllers/languesController')(router);
require(__dirname + '/controllers/roleController')(router);
require(__dirname + '/controllers/imageController')(router);
require(__dirname + '/controllers/themesController')(router);
require(__dirname + '/controllers/traductionController')(router);
require(__dirname + '/controllers/dispositifController')(router);
require(__dirname + '/controllers/channelController')(router, io);


//Partie dédiée à la messagerie instantanée
io.on('connection', function(socket){
  console.log('user connected');
  socket.on('subscribeToChat', function(){
    console.log('user subscribed')
  });
  socket.on('client:sendMessage', function(msg){
    if(msg && msg.data && msg.data.text){
      console.log('message utilisateur : ' + msg.data.text);
    }
    io.emit('MessageSent', msg);
  });
  socket.on('agent:sendMessage', function(msg){
    if(msg && msg.data && msg.data.text){
        console.log('message agent : ' + msg.data.text);
    }
    io.emit('MessageSent', msg);
  });
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(pageEntry) {
      pageEntry.messaging.forEach((messagingEvent) => {
        console.log({messagingEvent});
        if (messagingEvent.message) {
          handleReceiveMessage(messagingEvent);
        } else {
          console.log(
            'Webhook received unknown messagingEvent: ',
            messagingEvent
          );
        }
      });

      // // Gets the message. entry.messaging is an array, but 
      // // will only ever contain one message, so we get index 0
      // let webhook_event = entry.messaging[0];

      // sendHelloRewardMessage(senderId);
      // sendMessage(senderId, messages.helloRewardMessage);

      console.log(webhook_event);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

const handleReceiveMessage = (event) => {
  const message = event.message;
  const senderId = event.sender.id;

  // It's good practice to send the user a read receipt so they know
  // the bot has seen the message. This can prevent a user
  // spamming the bot if the requests take some time to return.
  sendApi.sendReadReceipt(senderId);

  if (message.text) { sendApi.sendHelloRewardMessage(senderId); }
};

const sendHelloRewardMessage = (recipientId) => {
  sendMessage(recipientId, messages.helloRewardMessage);
};

const sendMessage = (recipientId, messagePayloads) => {
  const messagePayloadArray = castArray(messagePayloads)
    .map((messagePayload) => messageToJSON(recipientId, messagePayload));

  api.callMessagesAPI([
    typingOn(recipientId),
    ...messagePayloadArray,
    typingOff(recipientId),
  ]);
};

const callMessagesAPI = (messageDataArray, queryParams = {}) => {
  return callAPI('messages', messageDataArray, queryParams);
};

const callAPI = (endPoint, messageDataArray, queryParams = {}, retries = 5) => {
  // Error if developer forgot to specify an endpoint to send our request to
  if (!endPoint) {
    console.error('callAPI requires you specify an endpoint.');
    return;
  }

  // Error if we've run out of retries.
  if (retries < 0) {
    console.error(
      'No more retries left.',
      {endPoint, messageDataArray, queryParams}
    );

    return;
  }

  // ensure query parameters have a PAGE_ACCESS_TOKEN value
  /* eslint-disable camelcase */
  const query = Object.assign({access_token: PAGE_ACCESS_TOKEN}, queryParams);
  /* eslint-enable camelcase */

  // ready the first message in the array for send.
  const [messageToSend, ...queue] = castArray(messageDataArray);
  request({
    uri: `https://graph.facebook.com/v3.2/me/${endPoint}`,
    qs: query,
    method: 'POST',
    json: messageToSend,

  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // Message has been successfully received by Facebook.
      console.log(
        `Successfully sent message to ${endPoint} endpoint: `,
        JSON.stringify(body)
      );

      // Continue sending payloads until queue empty.
      if (!isEmpty(queue)) {
        callAPI(endPoint, queue, queryParams);
      }
    } else {
      // Message has not been successfully received by Facebook.
      console.error(
        `Failed calling Messenger API endpoint ${endPoint}`,
        response.statusCode,
        response.statusMessage,
        body.error,
        queryParams
      );

      // Retry the request
      console.error(`Retrying Request: ${retries} left`);
      callAPI(endPoint, messageDataArray, queryParams, retries - 1);
    }
  });
};

app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "trucmuchebidule"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

//Définition et mise en place du port d'écoute
var ioport = process.env.PORTIO;
io.listen(ioport, () => console.log(`Listening on port ${port}`));
var port = process.env.PORT;
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
app.listen(port, () => console.log(`Listening on port ${port}`));