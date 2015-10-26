'use strict';
const config = require('config');
const twilio = require('twilio');

let TWILIO_ACCOUNT_SID = config.get('transport.twilio.account_sid');
let TWILIO_AUTH_TOKEN = config.get('transport.twilio.auth_token');

if (process.env.NODE_ENV === 'test') {
  TWILIO_ACCOUNT_SID = 'Some_random_account_sid';
  TWILIO_AUTH_TOKEN = 'Some_random_auth_token';
}
const messenger = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = messenger;
