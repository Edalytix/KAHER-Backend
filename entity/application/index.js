const FromCreateApplication = require("./create-application");
const FromUpdateApplication = require("./update-application");

exports.Applications = {
    CreateApplication: FromCreateApplication.createApplication,
    UpdateApplication: FromUpdateApplication.updateApplication,
}