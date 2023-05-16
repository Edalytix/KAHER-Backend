const fromCreateUsers = require("./create-user");

exports.userUseCases = {
    createUsers: fromCreateUsers.Create,
};