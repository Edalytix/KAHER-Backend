const express = require("express");
const router = express.Router();

const roleController = require("../controllers").role;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/roles/add", middlewares.isLogged,roleController.createRoles);
router.delete("/roles/delete",middlewares.isLogged, roleController.deleteRoles);
router.get("/roles/findall",middlewares.isLogged, roleController.findAllRoles);
router.patch("/roles/update",middlewares.isLogged, roleController.updateRoles);
router.get("/roles/find",middlewares.isLogged, roleController.findRoleDetails);

module.exports = router;
