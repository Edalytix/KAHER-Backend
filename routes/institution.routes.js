const express = require('express');
const router = express.Router();

const institutionController = require('../controllers').institution;

const middlewares = require('../middlewares');

/*
 * @desc /auth
 */
router.post(
  '/institution/add',
  middlewares.isLogged,
  institutionController.createInstitutions
);
router.delete(
  '/institution/delete',
  middlewares.isLogged,
  institutionController.deleteInstitutions
);
router.get(
  '/institution/findall',
  middlewares.isLogged,
  institutionController.findAllInstitutions
);
router.patch(
  '/institution/update',
  middlewares.isLogged,
  institutionController.updateInstitutions
);

module.exports = router;
