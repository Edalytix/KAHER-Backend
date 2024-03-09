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
const fromFindReports = require('./find-reports');
const fromFindApplierReports = require('./applier-report');
const fromFinanceReports = require('./finance-report');
const fromRegistrarReports = require('./registrar-report');
const fromFindApplicationScript = require('./application-script');
const fromVerifyDOI = require('./verify-doi');
const fromInstitutionReports = require('./institution-report');
const fromWorkflowReports = require('./workflow-report');
const fromApplicationApprovedReports = require('./application-approved-report');
const fromApplicationStatusReports = require('./application-status-report');
const fromResendPermission = require('./resend-permission');

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
  findReports: fromFindReports.findReports,
  findApplierReports: fromFindApplierReports.findApplierReports,
  financeReports: fromFinanceReports.financeReport,
  registrarReports: fromRegistrarReports.registrarReport,
  ApplicationScript: fromFindApplicationScript.FindAll,
  verifyDOI: fromVerifyDOI.VerifyDOI,
  findInstitutionReports: fromInstitutionReports.institutionReport,
  findWorkflowReports: fromWorkflowReports.workflowReport,
  findApplicationApprovedReports:
    fromApplicationApprovedReports.applicationApprovedReport,
  findApplicationStatusReports:
    fromApplicationStatusReports.applicationStatusReport,
  ResendPermission: fromResendPermission.ResendPermission,
};
