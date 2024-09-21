import express from "express";

import UserController from "./controllers/user";
import { authMiddleware } from "./middlewares/auth-middleware";

const router = express.Router();

const userController = new UserController();
router.post("/login", userController.login);
router.post("/account", userController.create);
router.get("/account/balance", authMiddleware, userController.balance);
router.post("/account/deposit", authMiddleware, userController.deposit);

export default router;
