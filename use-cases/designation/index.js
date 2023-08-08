const fromCreateDesignations = require('./add-designation');
const fromUpdateDesignations = require('./update-designation');
const fromFindAllDesignations = require('./find-all-designation');
const fromDeleteDesignations = require('./delete-designation');
const fromFindDesignationDetails = require('./find-designation-details');

exports.designationUseCases = {
  createDesignations: fromCreateDesignations.Create,
  updateDesignations: fromUpdateDesignations.Update,
  deleteDesignations: fromDeleteDesignations.Delete,
  findAllDesignations: fromFindAllDesignations.FindAll,
  findDesignationDetails: fromFindDesignationDetails.FindDetails,
};
