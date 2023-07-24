const fromCreateResponses = require('./create-response');
const fromUpdateResponses = require('./update-response');
const fromAddFile = require('./add-file');

exports.responseUseCases = {
  createResponses: fromCreateResponses.Create,
  updateResponses: fromUpdateResponses.Update,
  addFile: fromAddFile.AddFile,
  // deleteResponses: fromDeleteResponses.Delete,
  // findAllResponses: fromFindAllResponses.FindAll,
  // rolesDetails: fromResponsesDetails.RoleDetails
};
