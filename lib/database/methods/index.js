const fromDepartment = require("./department");
const fromRole = require('./roles');
const fromUser = require('./user');
const fromForm = require('./form');
const fromResponse = require('./response');
const fromWorkflow = require('./workflow');
const fromApplication = require('./application');
const fromComment = require('./comment');

exports.methods = {
  Department: fromDepartment.Department,
  Role: fromRole.Role,
  User: fromUser.User,
  Form: fromForm.Form,
  Response: fromResponse.Response,
  Workflow: fromWorkflow.Workflow,
  Application: fromApplication.Application,
  Comment: fromComment.Comment,
};
