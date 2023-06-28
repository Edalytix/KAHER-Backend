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
// router.delete("/form/delete", formController.deleteDepartment);
// router.get("/form/findall", formController.findAllDepartments);
router.patch('/response/update', formController.updateResponse);
// router.patch("/form/adduser", formController.addUser);
// router.get("/form/find", formController.formDetails);
// router.get("/form/findusers", formController.listUsers);
// router.patch("/form/removeuser", formController.removeUsers);

module.exports = router;
