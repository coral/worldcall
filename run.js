'use strict';

const express = require('express');
const bodyParser = require('body-parser')
const twilio = require('twilio');
const _ = require('lodash');
const jsonfile = require('jsonfile')

var file = '../callconf.json'
var config;
jsonfile.readFile(file, function(err, obj) {
	config = obj;
	console.log(config);
})

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))

app.post('/forward', (request, response) => {

  console.log(request.body);

  _.forEach(config.forwarders, function(value, key) {
  	if(request.body.ForwardedFrom == value.from){
  		const twiml = new twilio.twiml.VoiceResponse();

  		twiml.dial({
  			action: "/forward?Dial=true",
  			timeout: "20"
  		},
  		value.to);

  		response.type('text/xml');
  		response.send(twiml.toString());

  	}
  });
 
});

app.listen(3000);