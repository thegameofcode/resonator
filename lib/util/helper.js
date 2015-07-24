var config = require('config');

module.exports = {
  phoneNumberIsValid: phoneNumberIsValid
};

function phoneNumberIsValid(phoneNumber) {
  return phoneNumber.match(config.get('validations.phone_number')) !== null;
}