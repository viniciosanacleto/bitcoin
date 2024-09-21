import express from "express";

import UserController from "./controllers/user";
import { authMiddleware } from "./middlewares/auth-middleware";
import PositionController from "./controllers/position";

const router = express.Router();

const userController = new UserController();
router.post("/login", userController.login);
router.post("/account", userController.create);
router.get("/account/balance", authMiddleware, userController.balance);
router.post("/account/deposit", authMiddleware, userController.deposit);

const positionController = new PositionController();
router.post("/btc/purchase", authMiddleware, positionController.buy);
router.post("/btc/sell", authMiddleware, positionController.sell);
router.get("/btc/price", authMiddleware, positionController.price);
router.get("/btc", authMiddleware, positionController.positions);

export default router;
