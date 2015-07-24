var _ = require('lodash');
var config = require('config');

module.exports = {
  isEmpty: isEmpty,
  phoneNumberIsValid: phoneNumberIsValid
};

function isEmpty(testObject) {
  return _.keys(testObject).length === 0;
}

function phoneNumberIsValid(phoneNumber) {
  return phoneNumber.match(config.get('validations.phone_number')) !== undefined;
}