const { objectId, password } = require('./custom.validation');
const validate = require('./validate.middleware');

module.exports = { objectId, password, validate };
