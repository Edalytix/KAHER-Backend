const express = require("express");
const router = express.Router();

const userController = require("../controllers").user;

const middlewares = require("../middlewares");

/*
 * @desc /auth
 */
router.post("/users/add", middlewares.isLogged,userController.createUser);
router.post("/users/login",middlewares.isLogged, userController.Login);
router.get("/users/get",middlewares.isLogged, userController.findUser);
// router.delete("/users/delete", userController.deleteRoles);
router.get("/users/findall",middlewares.isLogged, userController.findAllUsers);
router.patch("/users/update",middlewares.isLogged, userController.updateUser);
router.delete("/users/delete",middlewares.isLogged, userController.deleteUser);


module.exports = router;
