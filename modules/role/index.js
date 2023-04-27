const Role = require('./role.model');
const roleController = require('./role.controller');
const roleService = require('./role.service');
const roleValidation = require('./role.validation');

module.exports = { roleController, Role, roleService, roleValidation };
