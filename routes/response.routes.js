const express = require('express');
const router = express.Router();

const formController = require('../controllers').response;

const middlewares = require('../middlewares');
const multer = require('multer');
const path = require('path');

const multerStorage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      console.log(req.uid);
      console.log(file);
      cb(null, path.join(__dirname + '/../lib/temp-file'));
    },
    filename: (req, file, cb) => {
      cb(null, req.uid + '_' + file.originalname);
    },
  }),
  limits: { fileSize: 52428800 }, // 50 MB
});

/*
 * @desc /auth
 */
router.post('/response/add', formController.createResponse);
router.post(
  '/response/addfile',
  multerStorage.fields([
    {
      name: 'file',
      maxCount: 20,
    },
  ]),
  formController.addFile
);
router.patch('/response/update', formController.updateResponse);

module.exports = router;
