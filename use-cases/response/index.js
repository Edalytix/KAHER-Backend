const fromCreateResponses = require("./create-response");
const fromUpdateResponses = require('./update-response');

exports.responseUseCases = {
    createResponses: fromCreateResponses.Create,
     updateResponses: fromUpdateResponses.Update,
    // deleteResponses: fromDeleteResponses.Delete,
    // findAllResponses: fromFindAllResponses.FindAll,
    // rolesDetails: fromResponsesDetails.RoleDetails
};