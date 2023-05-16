const fromDepartment = require("./department");
const fromRole = require("./role");
const fromUsers = require("./users");

exports.entities = {
  Department: { ...fromDepartment.Departments },
  Role: {...fromRole.Roles},
  User: {...fromUsers.Users}
};
