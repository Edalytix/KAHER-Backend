const fromCreateResponses = require('./create-response');
const fromUpdateResponses = require('./update-response');
const fromAddFile = require('./add-file');
const fromUpdateRejected = require('./edit-rejected-response');

exports.responseUseCases = {
  createResponses: fromCreateResponses.Create,
  updateResponses: fromUpdateResponses.Update,
  addFile: fromAddFile.AddFile,
  updateRejected: fromUpdateRejected.UpdateRejected,
  // deleteResponses: fromDeleteResponses.Delete,
  // findAllResponses: fromFindAllResponses.FindAll,
  // rolesDetails: fromResponsesDetails.RoleDetails
};
