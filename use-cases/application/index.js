const fromCreateApplications = require("./create-application");
const fromAddComment = require("./add-comment");
const fromGetComment = require("./get-comments");
// const fromDeleteForms = require("./delete-forms");
const fromSubmitApplications = require("./submit-application");
const fromDeleteApplications = require("./delete-application");
const fromFindAllApplications = require("./find-all-applications");
const fromUpdateApplications = require("./update-application");
const fromApplicationDetails = require("./application-details");
const fromGetAssignedApplications = require("./get-assigned-applications");

exports.applicationUseCases = {
    createApplications: fromCreateApplications.Create,
    addComment: fromAddComment.AddComment,
    getComment: fromGetComment.GetComment,
    updateApplications: fromUpdateApplications.Update,
    submitApplications: fromSubmitApplications.Submit,
    deleteApplications: fromDeleteApplications.Delete,
    findAllApplications: fromFindAllApplications.FindAll,
     ApplicationDetails: fromApplicationDetails.ApplicationDetails,
    getAssignedApplications: fromGetAssignedApplications.FindAssignedApps
};