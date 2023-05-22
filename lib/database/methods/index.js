const fromDepartment = require("./department");
const fromRole = require('./roles');
const fromUser = require('./user');
const fromForm = require('./form');
const fromResponse = require('./response');

exports.methods = {
  Department: fromDepartment.Department,
  Role: fromRole.Role,
  User: fromUser.User,
  Form: fromForm.Form,
  Response: fromResponse.Response,
};
