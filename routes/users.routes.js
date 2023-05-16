const express = require("express");
const router = express.Router();

const userController = require("../controllers").user;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/users/add", userController.createUser);
// router.delete("/users/delete", userController.deleteRoles);
// router.get("/users/findall", userController.findAllRoles);
// router.patch("/users/update", userController.updateRoles);

module.exports = router;
