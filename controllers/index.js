const fromDepartment = require('./department.controller');
const fromRole = require('./role.controller');
const fromUser = require('./user.controller');
const fromForm = require('./form.controller');
const fromResponse = require('.//response.controller');
const fromWorkflow = require('./workflow.controller');
const fromApplication = require('./application.controller');
const fromDesignation = require('./designation.controller');
const fromInstitution = require('./institution.controller');

const controllers = {
  department: { ...fromDepartment },
  role: { ...fromRole },
  user: { ...fromUser },
  form: { ...fromForm },
  response: { ...fromResponse },
  workflow: { ...fromWorkflow },
  application: { ...fromApplication },
  designation: { ...fromDesignation },
  institution: { ...fromInstitution },
};

module.exports = controllers;
