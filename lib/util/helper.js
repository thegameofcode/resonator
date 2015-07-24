var config = require('config');

module.exports = {
  phoneNumberIsValid: phoneNumberIsValid
};

function phoneNumberIsValid(phoneNumber) {
  return phoneNumber.toString().match(config.get('validations.phone_number')) !== null;
}