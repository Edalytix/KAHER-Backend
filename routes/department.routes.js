const express = require("express");
const router = express.Router();

const departmentController = require("../controllers").department;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/department/add",middlewares.isLogged, departmentController.createDepartment);
router.delete("/department/delete",middlewares.isLogged, departmentController.deleteDepartment);
router.get("/department/findall",middlewares.isLogged, departmentController.findAllDepartments);
router.patch("/department/update",middlewares.isLogged, departmentController.updateDepartment);
router.patch("/department/adduser",middlewares.isLogged, departmentController.addUser);
router.get("/department/find",middlewares.isLogged, departmentController.departmentDetails);
router.get("/department/findusers",middlewares.isLogged, departmentController.listUsers);
router.patch("/department/removeuser",middlewares.isLogged, departmentController.removeUsers);
router.patch("/department/addapplication",middlewares.isLogged, departmentController.addApplication);
router.patch("/department/removeapplication",middlewares.isLogged, departmentController.removeApplication);

module.exports = router;
