const fromCreateUsers = require("./create-user");
const fromLogin = require("./login")
exports.userUseCases = {
    createUsers: fromCreateUsers.Create,
    login: fromLogin.Login,
};