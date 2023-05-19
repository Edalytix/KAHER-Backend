const express = require("express");
const router = express.Router();

const departmentController = require("../controllers").department;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/department/add", departmentController.createDepartment);
router.delete("/department/delete", departmentController.deleteDepartment);
router.get("/department/findall", departmentController.findAllDepartments);
router.patch("/department/update", departmentController.updateDepartment);
router.patch("/department/adduser", departmentController.addUser);
router.get("/department/find", departmentController.departmentDetails);
router.get("/department/findusers", departmentController.listUsers);
router.patch("/department/removeuser", departmentController.removeUsers);

module.exports = router;
