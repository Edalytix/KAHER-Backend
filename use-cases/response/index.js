const fromCreateResponses = require('./create-response');
const fromUpdateResponses = require('./update-response');
const fromAddFile = require('./add-file');
const fromUpdateRejected = require('./edit-rejected-response');
const fromResubmitRejected = require('./resubmit-rejected');

exports.responseUseCases = {
  createResponses: fromCreateResponses.Create,
  updateResponses: fromUpdateResponses.Update,
  addFile: fromAddFile.AddFile,
  updateRejected: fromUpdateRejected.UpdateRejected,
  resubmitRejected: fromResubmitRejected.ResubmitRejected,
  // deleteResponses: fromDeleteResponses.Delete,
  // findAllResponses: fromFindAllResponses.FindAll,
  // rolesDetails: fromResponsesDetails.RoleDetails
};
