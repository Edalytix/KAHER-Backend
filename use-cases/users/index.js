const fromCreateUsers = require('./create-user');
const fromLogin = require('./login');
const fromUserDetails = require('./user-details');
const fromFindAllUsers = require('./find-all-users');
const fromFindAllUsersNoAuthorization = require('./find-all-no-authorization');
const fromUpdateUser = require('./update-user');
const fromDeleteUser = require('./delete-user');
const fromUploadExcel = require('./create-user-excel');

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
};
