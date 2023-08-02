const express = require('express');
const router = express.Router();

const userController = require('../controllers').user;

const middlewares = require('../middlewares');

/*
 * @desc /auth
 */
router.post('/users/add', middlewares.isLogged, userController.createUser);
router.post('/users/login', userController.Login);
router.get('/users/get', middlewares.isLogged, userController.findUser);
// router.delete("/users/delete", userController.deleteRoles);
router.get('/users/findall', middlewares.isLogged, userController.findAllUsers);
router.patch('/users/update', middlewares.isLogged, userController.updateUser);
router.delete('/users/delete', middlewares.isLogged, userController.deleteUser);
router.get(
  '/users/findallforusers',
  middlewares.isLogged,
  userController.findAllUsersNoAuthorization
);
router.post(
  '/users/excel',
  middlewares.isLogged,
  //   multerStorage.fields([
  //     {
  //       name: 'excel',
  //       maxCount: 1,
  //     },
  //   ]),
  userController.uploadExcel
);

// router.get(
//   '/users/passwordreset',
//   middlewares.isLogged,
//   userController.PasswordReset
// );

router.get('/users/passwordreset', userController.PasswordReset);

router.post('/users/passwordreset', userController.PasswordReset);

module.exports = router;
