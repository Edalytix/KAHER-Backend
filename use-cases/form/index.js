const fromCreateForms = require("./create-form");
const fromDeleteForms = require("./delete-form");
const fromFindAllForms = require("./find-all-forms");
const fromUpdateForms = require("./update-form");
const fromFormDetails = require("./form-details");


exports.formUseCases = {
    createForms: fromCreateForms.Create,
     updateForms: fromUpdateForms.Update,
     deleteForms: fromDeleteForms.Delete,
     findAllForms: fromFindAllForms.FindAll,
     formDetails: fromFormDetails.FormDetails
};