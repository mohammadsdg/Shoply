import express from "express";
import UsersController from "../controllers/users.ts";
import UserService from "../services/users.ts";
const router = express.Router();

const userService = new UserService();
const userController = new UsersController(userService);

router.get("/users", userController.getAllUsers)
router.post("/users/login", userController.getUser);
router.post("/users/register", userController.setUser);

export default router;