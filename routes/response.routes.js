const express = require("express");
const router = express.Router();

const formController = require("../controllers").response;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/response/add", formController.createResponse);
// router.delete("/form/delete", formController.deleteDepartment);
// router.get("/form/findall", formController.findAllDepartments);
// router.patch("/form/update", formController.updateDepartment);
// router.patch("/form/adduser", formController.addUser);
// router.get("/form/find", formController.formDetails);
// router.get("/form/findusers", formController.listUsers);
// router.patch("/form/removeuser", formController.removeUsers);

module.exports = router;
