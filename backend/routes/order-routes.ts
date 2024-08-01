import { Router } from "express";
// controllers
import {
  getOrderHistory,
  getOrderHistoryById,
} from "../controllers/order-controllers";
// middlewares
import { verifyToken } from "../middlewares/auth-middleware";

const router = Router();

// checking if im logged in
router.use(verifyToken);

// routes
router.get("/history", getOrderHistory);
router.get("/history/:orderId", getOrderHistoryById);

export default router;
