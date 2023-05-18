const fromCreateRoles = require("./create-role");
const fromUpdateRoles = require("./update-role");
const fromFindAllRoles = require("./find-all-roles");
const fromDeleteRoles = require("./delete-role");
const fromRolesDetails = require("./role-details");

exports.roleUseCases = {
    createRoles: fromCreateRoles.Create,
    updateRoles: fromUpdateRoles.Update,
    deleteRoles: fromDeleteRoles.Delete,
    findAllRoles: fromFindAllRoles.FindAll,
    rolesDetails: fromRolesDetails.RoleDetails
};