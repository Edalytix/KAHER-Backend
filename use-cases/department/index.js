const fromCreateDepartments = require("./create-department");
const fromDeleteDepartments = require("./delete-department");
const fromFindAllDepartments = require("./find-all-department");
const fromUpdateDepartments = require("./update-department");
const fromDepartmentDetails = require("./department-details");
const fromAddUser = require("./add-user");
const fromDepatmentDetails = require("./department-details");

exports.departmentUseCases = {
    createDepartments: fromCreateDepartments.Create,
    deleteDepartments: fromDeleteDepartments.Delete,
    findAllDepartments: fromFindAllDepartments.FindAll,
    updateDepartments: fromUpdateDepartments.Update,
    departmentDetails: fromDepartmentDetails.DepartmentDetails,
    addUser: fromAddUser.AddUser,
    depatmentDetails: fromDepatmentDetails.DepartmentDetails
};