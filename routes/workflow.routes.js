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
router.patch("/workflow/update", middlewares.isLogged,workflowController.updateWorkflows);
router.get("/workflow/find", middlewares.isLogged,workflowController.workflowDetails);


module.exports = router;
