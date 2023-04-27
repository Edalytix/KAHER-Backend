const express = require('express');
const {
  roleService,
  roleController,
  roleValidation,
} = require('../../modules/role');
const { validate } = require('../../modules/validate');

const router = express.Router();

router
  .route('/')
  .post(validate(roleValidation.createRole), roleController.createRole);
// router.post('/login', validate(authValidation.login), authController.login);
// router.post('/verifiy-user/:token', authController.verifyUser);
// router.post('/forgotPassword', authController.forgotPassword);
// router.post('/resetPassword/:token', authController.resetPassword);

module.exports = router;
