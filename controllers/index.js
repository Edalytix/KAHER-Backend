const fromDepartment = require("./department.controller");
const fromRole = require("./role.controller")
const fromUser = require("./user.controller")

const controllers = {
    department: { ...fromDepartment },
    role: {...fromRole},
    user: {...fromUser}
  
};

module.exports = controllers;
