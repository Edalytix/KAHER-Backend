const express = require('express');
const { authController, authValidation } = require('../../modules/auth');
const { validate } = require('../../modules/validate');

const router = express.Router();

router.post(
  '/signup',
  validate(authValidation.register),
  authController.signUp
);
router.post('/login', validate(authValidation.login), authController.login);
// router.post('/verifiy-user/:token', authController.verifyUser);
// router.post('/forgotPassword', authController.forgotPassword);
// router.post('/resetPassword/:token', authController.resetPassword);

module.exports = router;
