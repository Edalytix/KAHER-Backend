const FromAddUser = require('./add-users');
const FromLoginUser = require('./login');
const FromUpdateUser = require('./update-users');
const FromAddDesignation = require('./add-designation');
const FromUpdateDesignation = require('./update-designation');
const FromAddInstitution = require('./add-institution');
const FromUpdateInstitution = require('./update-institution');
const fromResetPassword = require('./reset-password');

exports.Users = {
  addUser: FromAddUser.addUser,
  loginUser: FromLoginUser.login,
  updateUser: FromUpdateUser.updateUser,
  addDesignation: FromAddDesignation.addDesignation,
  updateDesignation: FromUpdateDesignation.updateDesignation,
  addInstitution: FromAddInstitution.addInstitution,
  updateInstitution: FromUpdateInstitution.updateInstitution,
  resetPassword: fromResetPassword.resetPassword,
};
