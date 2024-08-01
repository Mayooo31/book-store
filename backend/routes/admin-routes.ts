import { Router } from "express";
// controllers
import {
  addBook,
  deleteBook,
  updateBook,
  getAllOrders,
  updateOrderStatus,
  getStatistics,
  getGenres,
} from "../controllers/admin-controllers";
// middlewares
import { verifyToken, verifyIsUserAdmin } from "../middlewares/auth-middleware";

const router = Router();

// checking if im logged in and if im admin...
router.use(verifyToken, verifyIsUserAdmin);

// routes
router.get("/orders", getAllOrders);
router.patch(
  "/orders/:orderId/status",
  verifyToken,
  verifyIsUserAdmin,
  updateOrderStatus
);
router.post("/books/add", addBook);
router.put("/books/:bookId", updateBook);
router.delete("/books/:bookId", deleteBook);
router.get("/statistics", getStatistics);
router.get("/genres", getGenres);

export default router;
