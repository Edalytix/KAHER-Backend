const express = require('express');
const router = express.Router();

const applicationController = require('../controllers').application;

const middlewares = require('../middlewares');
const appMiddlewares = require('../middlewares');
const path = require('path');

const multer = require('multer');
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
  limits: { fileSize: 5242880 }, // 50 MB
});
/*
 * @desc /auth
 */
router.post(
  '/application/add',
  middlewares.isLogged,
  applicationController.createApplication
);

router.get('/app-health-check');
router.delete(
  '/application/delete',
  middlewares.isLogged,
  applicationController.deleteApplication
);
router.get(
  '/application/findall',
  middlewares.isLogged,
  applicationController.findAllApplications
);
router.patch(
  '/application/update',
  middlewares.isLogged,
  applicationController.updateApplication
);
router.get(
  '/application/find',
  middlewares.isLogged,
  applicationController.applicationDetails
);

router.get(
  '/user/application/find',
  middlewares.isLogged,
  applicationController.applicationDetailsForUser
);

router.patch(
  '/application/addform',
  middlewares.isLogged,
  applicationController.addForm
);
router.delete(
  '/application/removeform',
  middlewares.isLogged,
  applicationController.removeForms
);
router.get(
  '/application/getassigned',
  middlewares.isLogged,
  applicationController.getAssignedApplications
);
router.post(
  '/application/submit',
  middlewares.isLogged,
  applicationController.submitApplications
);
router.post(
  '/application/addcomment',
  middlewares.isLogged,
  multerStorage.fields([
    {
      name: 'picture',
      maxCount: 1,
    },
  ]),
  applicationController.addComment
);
router.get(
  '/application/getcomment',
  middlewares.isLogged,
  applicationController.getComment
);
router.get(
  '/application/userapplications',
  middlewares.isLogged,
  applicationController.getUserApplications
);
router.post(
  '/application/approvalupdate',
  appMiddlewares.isLogged,
  applicationController.approveApplication
);
router.get(
  '/admin/application/userapplications',
  middlewares.isLogged,
  applicationController.getUserApplicationsViaAdmin
);
router.get(
  '/application/reports',
  middlewares.isLogged,
  applicationController.getReports
);

router.get(
  '/application/applierreports',
  middlewares.isLogged,
  applicationController.getApplierReports
);

router.get(
  '/application/financereport',
  middlewares.isLogged,
  applicationController.financeReport
);

router.get(
  '/application/registrarreport',
  middlewares.isLogged,
  applicationController.registrarReports
);

router.get('/application/script', applicationController.applicationScript);

router.post('/verify/doi', applicationController.verifyDOI);

router.get(
  '/application/institutionreport',
  middlewares.isLogged,
  applicationController.institutionReports
);

router.get(
  '/application/workflowreport',
  middlewares.isLogged,
  applicationController.workflowReports
);

router.get(
  '/application/applicationapprovedreport',
  middlewares.isLogged,
  applicationController.applicationApprovedReports
);

router.get(
  '/application/applicationstatusreport',
  middlewares.isLogged,
  applicationController.applicationStatusReports
);
//
module.exports = router;
