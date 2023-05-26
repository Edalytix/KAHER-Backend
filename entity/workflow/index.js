const FromCreateWorkflow = require('./create-workflow');
const FromUpdateWorkflow = require("./update-workflow");
const FromAddForm =  require('./add-form');

exports.Workflows = {
    CreateWorkflow: FromCreateWorkflow.createWorkflow,
    AddForm: FromAddForm.addForms,
    UpdateWorkflow: FromUpdateWorkflow.updateWorkflow,
}