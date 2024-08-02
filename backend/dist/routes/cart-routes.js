"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// controllers
const cart_controllers_1 = require("../controllers/cart-controllers");
// middlewares
const auth_middleware_1 = require("../middlewares/auth-middleware");
const router = (0, express_1.Router)();
// checking if im logged in
router.use(auth_middleware_1.verifyToken);
// routes
router.get("/total-items", cart_controllers_1.totalItemsInCart);
router.get("/", cart_controllers_1.viewCart);
router.post("/add", cart_controllers_1.addItemToCart);
router.delete("/", cart_controllers_1.removeAllItemsFromCart);
router.delete("/:itemId", cart_controllers_1.removeItemFromCart);
router.post("/checkout", cart_controllers_1.createOrder);
exports.default = router;
