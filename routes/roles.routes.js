const express = require("express");
const router = express.Router();

const roleController = require("../controllers").role;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/roles/add", roleController.createRoles);
router.delete("/roles/delete", roleController.deleteRoles);
router.get("/roles/findall", roleController.findAllRoles);
router.patch("/roles/update", roleController.updateRoles);
router.get("/roles/find", roleController.findRoleDetails);

module.exports = router;
