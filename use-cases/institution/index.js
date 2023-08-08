const fromCreateInstitutions = require('./add-institution');
const fromUpdateInstitutions = require('./update-institution');
const fromFindAllInstitutions = require('./find-all-institution');
const fromDeleteInstitutions = require('./delete-institution');
const fromFindInstitutionDetails = require('./find-institution-details');

exports.institutionUseCases = {
  createInstitutions: fromCreateInstitutions.Create,
  updateInstitutions: fromUpdateInstitutions.Update,
  deleteInstitutions: fromDeleteInstitutions.Delete,
  findAllInstitutions: fromFindAllInstitutions.FindAll,
  findInstitutionDetails: fromFindInstitutionDetails.FindDetails,
};
