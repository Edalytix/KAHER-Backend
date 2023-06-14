const FromCreateApplication = require("./create-application");
const FromUpdateApplication = require("./update-application");
const FromAddComment = require("./add-comment");

exports.Applications = {
    CreateApplication: FromCreateApplication.createApplication,
    UpdateApplication: FromUpdateApplication.updateApplication,
    AddComment: FromAddComment.addComment
}