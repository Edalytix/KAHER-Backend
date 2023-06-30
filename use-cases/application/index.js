const fromCreateApplications = require('./create-application');
const fromAddComment = require('./add-comment');
const fromGetComment = require('./get-comments');
const fromGetUserApplications = require('./get-user-application');
const fromApproveApplication = require('./approve-application');
const fromSubmitApplications = require('./submit-application');
const fromDeleteApplications = require('./delete-application');
const fromFindAllApplications = require('./find-all-applications');
const fromUpdateApplications = require('./update-application');
const fromApplicationDetails = require('./application-details');
const fromApplicationDetailsForUser = require('./application-details-user');
const fromGetAssignedApplications = require('./get-assigned-applications');
const fromGetAssignedViaAdminApplications = require('./get-user-application-admin');

exports.applicationUseCases = {
  createApplications: fromCreateApplications.Create,
  addComment: fromAddComment.AddComment,
  getComment: fromGetComment.GetComment,
  updateApplications: fromUpdateApplications.Update,
  submitApplications: fromSubmitApplications.Submit,
  deleteApplications: fromDeleteApplications.Delete,
  findAllApplications: fromFindAllApplications.FindAll,
  ApplicationDetails: fromApplicationDetails.ApplicationDetails,
  ApplicationDetailsForUser: fromApplicationDetailsForUser.ApplicationDetails,
  getAssignedApplications: fromGetAssignedApplications.FindAssignedApps,
  getAssignedViaAdminApplications:
    fromGetAssignedViaAdminApplications.FindAllOfUsers,
  getUserApplications: fromGetUserApplications.FindAllOfUsers,
  approveApplication: fromApproveApplication.ApprovalUpdate,
};
