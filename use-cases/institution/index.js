const fromCreateInstitutions = require('./add-institution');
const fromUpdateInstitutions = require('./update-institution');
const fromFindAllInstitutions = require('./find-all-institution');
const fromDeleteInstitutions = require('./delete-institution');

exports.institutionUseCases = {
  createInstitutions: fromCreateInstitutions.Create,
  updateInstitutions: fromUpdateInstitutions.Update,
  deleteInstitutions: fromDeleteInstitutions.Delete,
  findAllInstitutions: fromFindAllInstitutions.FindAll,
};
