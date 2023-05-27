const express = require("express");
const router = express.Router();

const applicationController = require("../controllers").application;

const middlewares = require("../middlewares");

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

module.exports = router;
