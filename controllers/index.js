const fromDepartment = require("./department.controller");
const fromRole = require("./role.controller")
const fromUser = require("./user.controller")
const fromForm = require("./form.controller")
const fromResponse = require(".//response.controller")
const fromWorkflow = require("./workflow.controller")

const controllers = {
    department: { ...fromDepartment },
    role: {...fromRole},
    user: {...fromUser},
    form: {...fromForm},
    response: {...fromResponse},
    workflow: {...fromWorkflow}
  
};

module.exports = controllers;
