var config = require('config');
var twilio = require('twilio');

var TWILIO_ACCOUNT_SID = config.get('transport.twilio.account_sid');
var TWILIO_AUTH_TOKEN = config.get('transport.twilio.auth_token');

if (process.env.NODE_ENV === 'test') {
  TWILIO_ACCOUNT_SID = "Some_random_account_sid";
  TWILIO_AUTH_TOKEN = "Some_random_auth_token";
}
var messenger = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

module.exports = messenger;
