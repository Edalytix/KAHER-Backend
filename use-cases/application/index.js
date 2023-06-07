const fromCreateApplications = require("./create-application");
// const fromAddForms = require("./add-forms");
// const fromDeleteForms = require("./delete-forms");
const fromDeleteApplications = require("./delete-application");
const fromFindAllApplications = require("./find-all-applications");
const fromUpdateApplications = require("./update-application");
const fromApplicationDetails = require("./application-details");
const fromGetAssignedApplications = require("./get-assigned-applications");

exports.applicationUseCases = {
    createApplications: fromCreateApplications.Create,
    // addForms: fromAddForms.AddForm,
    // deleteForms: fromDeleteForms.RemoveForm,
    updateApplications: fromUpdateApplications.Update,
    deleteApplications: fromDeleteApplications.Delete,
    findAllApplications: fromFindAllApplications.FindAll,
     ApplicationDetails: fromApplicationDetails.ApplicationDetails,
    getAssignedApplications: fromGetAssignedApplications.FindAssignedApps
};