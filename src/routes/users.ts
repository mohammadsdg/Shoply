import express from "express";
import UsersController from "../controllers/users.js";
import UserService from "../services/users.js";
const router = express.Router();

const userService = new UserService();
const userController = new UsersController(userService);

router.get("/users", userController.getAllUsers)
router.post("/users/login", userController.getUser);
router.post("/users/register", userController.setUser);
router.post('/users/register-role', userController.setRole);

export default router;