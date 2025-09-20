import express from "express";
import UsersController from "../controllers/users.ts";
const router = express.Router();

router.get("/users", UsersController.getAllUsers)
router.post("/users/login", UsersController.getUser);
router.post("/users/register", UsersController.setUser);

export default router;