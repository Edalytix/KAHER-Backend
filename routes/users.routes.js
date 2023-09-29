const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers').user;

const middlewares = require('../middlewares');
const multerStorage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname + '/../lib/temp-file'));
    },
    filename: (req, file, cb) => {
      cb(null, req.uid + '_' + file.originalname);
    },
  }),
  limits: { fileSize: 5242880 }, // 50 MB
});
/*
 * @desc /auth
 */
router.post(
  '/users/add',
  middlewares.isLogged,
  multerStorage.fields([
    {
      name: 'profile_picture',
      maxCount: 1,
    },
  ]),
  userController.createUser
);
router.post('/users/login', userController.Login);
router.get('/users/get', middlewares.isLogged, userController.findUser);
// router.delete("/users/delete", userController.deleteRoles);
router.get('/users/findall', middlewares.isLogged, userController.findAllUsers);
router.patch(
  '/users/update',
  middlewares.isLogged,
  multerStorage.fields([
    {
      name: 'profile_picture',
      maxCount: 1,
    },
  ]),
  userController.updateUser
);
router.delete('/users/delete', middlewares.isLogged, userController.deleteUser);
router.get(
  '/users/findallforusers',
  middlewares.isLogged,
  userController.findAllUsersNoAuthorization
);
router.post(
  '/users/excel',
  middlewares.isLogged,
  multerStorage.fields([
    {
      name: 'excel',
      maxCount: 1,
    },
  ]),
  userController.uploadExcel
);

router.post(
  '/users/excelemails',
  middlewares.isLogged,
  multerStorage.fields([
    {
      name: 'excel',
      maxCount: 1,
    },
  ]),
  userController.SendExcelEmail
);

router.get('/users/passwordreset', userController.PasswordReset);

router.post('/users/passwordreset', userController.PasswordReset);
router.post('/users/setpassword', userController.SetPassword);
router.get(
  '/users/findallexcel',
  middlewares.isLogged,
  userController.fromFindAllForExcel
);
router.get('/users/dashboard/admin', userController.AdminDashboard);
router.get('/users/dashboard/approver', userController.ApproverDashboard);
module.exports = router;
