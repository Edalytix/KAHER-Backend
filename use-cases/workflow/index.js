const fromCreateWorkflows = require("./create-workflow");
// const fromDeleteWorkflows = require("./delete-workflow");
// const fromFindAllWorkflows = require("./find-all-workflows");
// const fromUpdateWorkflows = require("./update-workflow");
// const fromWorkflowDetails = require("./workflow-details");


exports.workflowUseCases = {
    createWorkflows: fromCreateWorkflows.Create,
    //  updateWorkflows: fromUpdateWorkflows.Update,
    //  deleteWorkflows: fromDeleteWorkflows.Delete,
    //  findAllWorkflows: fromFindAllWorkflows.FindAll,
    //  workflowDetails: fromWorkflowDetails.WorkflowDetails
};