const express = require('express');
const router = express.Router();

const formController = require('../controllers').response;

const middlewares = require('../middlewares');
const multer = require('multer');
const path = require('path');

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
  '/response/add',
  middlewares.isLogged,
  formController.createResponse
);
router.post(
  '/response/addfile',
  middlewares.isLogged,
  multerStorage.fields([
    {
      name: 'file',
      maxCount: 20,
    },
  ]),
  formController.addFile
);
router.patch(
  '/response/update',
  middlewares.isLogged,
  formController.updateResponse
);
router.patch(
  '/response/editrejected',
  middlewares.isLogged,
  formController.updateRejected
);

router.patch(
  '/response/resubmitrejected',
  middlewares.isLogged,
  formController.resubmitRejected
);
module.exports = router;
