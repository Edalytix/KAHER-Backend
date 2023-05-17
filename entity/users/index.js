const FromAddUser = require('./add-users');
const FromLoginUser = require('./login');
const FromUpdateUser = require('./update-users');

exports.Users = {
    addUser: FromAddUser.addUser,
    loginUser: FromLoginUser.login,
    updateUser: FromUpdateUser.updateUser

}