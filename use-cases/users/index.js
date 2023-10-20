const fromCreateUsers = require('./create-user');
const fromLogin = require('./login');
const fromUserDetails = require('./user-details');
const fromFindAllUsers = require('./find-all-users');
const fromFindAllUsersNoAuthorization = require('./find-all-no-authorization');
const fromUpdateUser = require('./update-user');
const fromDeleteUser = require('./delete-user');
const fromUploadExcel = require('./create-user-excel');
const fromPasswordReset = require('./password-reset');
const fromSetPassword = require('./set-password');
const fromSendExcelEmail = require('./send-excel-emails');
const fromFindAllForExcel = require('./find-all-users-excel');
const fromBruteResetPassword = require('./brute-password-reset');

exports.userUseCases = {
  createUsers: fromCreateUsers.Create,
  login: fromLogin.Login,
  userDetails: fromUserDetails.UserDetails,
  findAllUsers: fromFindAllUsers.FindAllUsers,
  updateUser: fromUpdateUser.Update,
  deleteUser: fromDeleteUser.Delete,
  uploadExcel: fromUploadExcel.CreateUserExcel,
  findAllUsersNoAuthorization:
    fromFindAllUsersNoAuthorization.FindAllUsersNoAuthorization,
  PasswordReset: fromPasswordReset.PasswordReset,
  SetPassword: fromSetPassword.SetPassword,
  SendExcelEmail: fromSendExcelEmail.SendExcelEmail,
  fromFindAllForExcel: fromFindAllForExcel.findAllForExcel,
  BruteResetPassword: fromBruteResetPassword.BruteResetPassword,
};
