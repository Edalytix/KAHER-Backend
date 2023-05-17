const express = require("express");
const router = express.Router();

const userController = require("../controllers").user;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/users/add", userController.createUser);
router.post("/users/login", userController.Login);
router.get("/users/get", userController.findUser);
// router.delete("/users/delete", userController.deleteRoles);
router.get("/users/findall", userController.findAllUsers);
router.patch("/users/update", userController.updateUser);

module.exports = router;
