const express = require('express');
const router = express.Router();

const designationController = require('../controllers').designation;

const middlewares = require('../middlewares');

/*
 * @desc /auth
 */
router.post(
  '/designation/add',
  middlewares.isLogged,
  designationController.createDesignations
);
router.delete(
  '/designation/delete',
  middlewares.isLogged,
  designationController.deleteDesignations
);
router.get(
  '/designation/findall',
  middlewares.isLogged,
  designationController.findAllDesignations
);
router.patch(
  '/designation/update',
  middlewares.isLogged,
  designationController.updateDesignations
);

module.exports = router;
