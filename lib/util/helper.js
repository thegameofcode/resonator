var _ = require('lodash');

module.exports = {
  isEmpty: isEmpty
};

function isEmpty(testObject) {
  return _.keys(testObject).length === 0;
}