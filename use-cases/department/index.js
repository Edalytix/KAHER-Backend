const fromCreateDepartments = require("./create-department");
const fromDeleteDepartments = require("./delete-department");
const fromFindAllDepartments = require("./find-all-department");
const fromUpdateDepartments = require("./update-department");
exports.departmentUseCases = {
    createDepartments: fromCreateDepartments.Create,
    deleteDepartments: fromDeleteDepartments.Delete,
    findAllDepartments: fromFindAllDepartments.FindAll,
    updateDepartments: fromUpdateDepartments.Update
};