"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const admin_controllers_1 = require("../controllers/admin-controllers");
// middlewares
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = (0, express_1.Router)();
// checking if im logged in and if im admin...
router.use(auth_middleware_1.verifyToken, auth_middleware_1.verifyIsUserAdmin);
// routes
router.get("/orders", admin_controllers_1.getAllOrders);
router.patch("/orders/:orderId/status", auth_middleware_1.verifyToken, auth_middleware_1.verifyIsUserAdmin, admin_controllers_1.updateOrderStatus);
router.post("/books/add", admin_controllers_1.addBook);
router.put("/books/:bookId", admin_controllers_1.updateBook);
router.delete("/books/:bookId", admin_controllers_1.deleteBook);
router.get("/statistics", admin_controllers_1.getStatistics);
router.get("/genres", admin_controllers_1.getGenres);
exports.default = router;
