const express = require("express");
const router = express.Router();

const workflowController = require("../controllers").workflow;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/workflow/add",middlewares.isLogged, workflowController.createWorkflow);
router.delete("/workflow/delete",middlewares.isLogged, workflowController.deleteWorkflow);
router.get("/workflow/findall",middlewares.isLogged, workflowController.findAllWorkflows);
router.patch("/workflow/update", middlewares.isLogged,workflowController.updateWorkflow);
router.get("/workflow/find", middlewares.isLogged,workflowController.workflowDetails);
router.patch("/workflow/addform", middlewares.isLogged,workflowController.addForm);
router.delete("/workflow/removeform", middlewares.isLogged,workflowController.removeForms);

module.exports = router;
