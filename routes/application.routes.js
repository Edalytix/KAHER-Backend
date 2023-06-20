const express = require("express");
const router = express.Router();

const applicationController = require("../controllers").application;

const middlewares = require("../middlewares");
const appMiddlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/application/add",middlewares.isLogged, applicationController.createApplication);
router.delete("/application/delete",middlewares.isLogged, applicationController.deleteApplication);
router.get("/application/findall",middlewares.isLogged, applicationController.findAllApplications);
router.patch("/application/update", middlewares.isLogged,applicationController.updateApplication);
router.get("/application/find", middlewares.isLogged,applicationController.applicationDetails);
router.patch("/application/addform", middlewares.isLogged,applicationController.addForm);
router.delete("/application/removeform", middlewares.isLogged,applicationController.removeForms);
router.get("/application/getassigned",middlewares.isLogged, applicationController.getAssignedApplications);
router.post("/application/submit",middlewares.isLogged, applicationController.submitApplications);
router.post("/application/addcomment",middlewares.isLogged, applicationController.addComment);
router.get("/application/getcomment",middlewares.isLogged, applicationController.getComment);
router.get("/application/userapplications",middlewares.isLogged, applicationController.getUserApplications);
router.post("/application/approvalupdate", appMiddlewares.isLogged, applicationController.approveApplication)
module.exports = router;
