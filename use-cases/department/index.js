const fromCreateDepartments = require("./create-department");
const fromDeleteDepartments = require("./delete-department");
const fromFindAllDepartments = require("./find-all-department");
const fromUpdateDepartments = require("./update-department");
const fromDepartmentDetails = require("./department-details");
const fromAddUser = require("./add-user");
const fromDepatmentDetails = require("./department-details");
const fromListUser = require("./list-users");
const fromRemoveUser = require("./remove-user");
const fromAddApplication = require("./add-application");
const fromRemoveApplication = require("./remove-application");

exports.departmentUseCases = {
    createDepartments: fromCreateDepartments.Create,
    deleteDepartments: fromDeleteDepartments.Delete,
    findAllDepartments: fromFindAllDepartments.FindAll,
    updateDepartments: fromUpdateDepartments.Update,
    departmentDetails: fromDepartmentDetails.DepartmentDetails,
    addUser: fromAddUser.AddUser,
    depatmentDetails: fromDepatmentDetails.DepartmentDetails,
    listUser: fromListUser.ListUsers,
    removeUser: fromRemoveUser.RemoveUser,
    addApplication: fromAddApplication.AddApplication,
    removeApplication: fromRemoveApplication.RemoveApplication,
};