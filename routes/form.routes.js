const express = require("express");
const router = express.Router();

const formController = require("../controllers").form;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/form/add",middlewares.isLogged, formController.createForm);
router.delete("/form/delete",middlewares.isLogged, formController.deleteForm);
router.get("/form/findall",middlewares.isLogged, formController.findAllForms);
router.patch("/form/update", middlewares.isLogged,formController.updateForms);
router.get("/form/find", middlewares.isLogged,formController.formDetails);


module.exports = router;
