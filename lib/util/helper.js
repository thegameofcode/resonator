var config = require('config');

module.exports = {
  isPhoneNumber: isPhoneNumber,
  isEmail: isEmail
};

function isPhoneNumber(phoneNumber) {
  return phoneNumber.toString().match(config.get('validations.phone_number')) !== null;
}

function isEmail(email) {
  return email.match(config.get('validations.email')) !== null;
}