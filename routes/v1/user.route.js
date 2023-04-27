const express = require('express');

const router = express.Router();
const userController = require('../../modules/user/user.controller');
const authMiddleware = require('../../modules/auth/auth.middleware');

// token middleware
router.use(authMiddleware.protect);

// update password
// router.patch('/updatePassword', authController.updatePassword);
// router.get('/me', userController.getMe, userController.getUser);
// router.patch('/updateMe', userController.updateMe);
// router.delete('/deleteMe', userController.deleteMe);

// role protection
router.use(authMiddleware.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

// router
//   .route('/:id')
//   .get(userController.getUser)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
