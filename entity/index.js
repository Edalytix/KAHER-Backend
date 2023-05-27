const fromDepartment = require("./department");
const fromRole = require("./role");
const fromUsers = require("./users");
const fromForm = require("./form");
const fromResponse = require("./response");
const fromWorkflow = require("./workflow");
const fromApplication = require("./application");

exports.entities = {
  Department: { ...fromDepartment.Departments },
  Role: {...fromRole.Roles},
  User: {...fromUsers.Users},
  Form: {...fromForm.Forms},
  Response: {...fromResponse.Responses},
  Workflow: {...fromWorkflow.Workflows},
  Application: {...fromApplication.Applications}
};
