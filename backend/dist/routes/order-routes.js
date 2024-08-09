"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const order_controllers_1 = require("../controllers/order-controllers");
// middlewares
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = (0, express_1.Router)();
// checking if im logged in
router.use(auth_middleware_1.verifyToken);
// routes
router.get("/history", order_controllers_1.getOrderHistory);
router.get("/history/:orderId", order_controllers_1.getOrderHistoryById);
exports.default = router;
