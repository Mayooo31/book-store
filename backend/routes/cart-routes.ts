import { Router } from "express";
// controllers
import {
  addItemToCart,
  viewCart,
  removeItemFromCart,
  createOrder,
  totalItemsInCart,
  removeAllItemsFromCart
} from "../controllers/cart-controllers";
// middlewares
import { verifyToken } from "../middlewares/auth-middleware";

const router = Router();

// checking if im logged in
router.use(verifyToken);

// routes
router.get("/total-items", totalItemsInCart);
router.get("/", viewCart);
router.post("/add", addItemToCart);
router.delete("/", removeAllItemsFromCart);
router.delete("/:itemId", removeItemFromCart);
router.post("/checkout", createOrder);

export default router;
