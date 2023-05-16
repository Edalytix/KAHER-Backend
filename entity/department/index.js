const FromAddDepartment = require('./add-department');
const FromUpdateDepartment = require('./update-department');

exports.Departments = {
    addDepartment: FromAddDepartment.addDepartment,
    updateDepartment: FromUpdateDepartment.updateDepartment,
}