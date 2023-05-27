const fromCreateWorkflows = require("./create-workflow");
const fromAddForms = require("./add-forms");
const fromDeleteForms = require("./delete-forms");
const fromDeleteWorkflows = require("./delete-workflow");
const fromFindAllWorkflows = require("./find-all-workflows");
const fromUpdateWorkflows = require("./update-workflow");
const fromWorkflowDetails = require("./workflow-details");


exports.workflowUseCases = {
    createWorkflows: fromCreateWorkflows.Create,
    addForms: fromAddForms.AddForm,
    deleteForms: fromDeleteForms.RemoveForm,
    updateWorkflows: fromUpdateWorkflows.Update,
    deleteWorkflows: fromDeleteWorkflows.Delete,
    findAllWorkflows: fromFindAllWorkflows.FindAll,
     workflowDetails: fromWorkflowDetails.WorkflowDetails
};