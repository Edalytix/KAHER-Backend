const FromAddUser = require('./add-users');
const FromLoginUser = require('./login');

exports.Users = {
    addUser: FromAddUser.addUser,
    loginUser: FromLoginUser.login

}