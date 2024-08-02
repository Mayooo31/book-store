"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
// importing routes
const auth_routes_1 = __importDefault(require("../routes/auth-routes"));
const book_routes_1 = __importDefault(require("../routes/book-routes"));
const order_routes_1 = __importDefault(require("../routes/order-routes"));
const admin_routes_1 = __importDefault(require("../routes/admin-routes"));
const cart_routes_1 = __importDefault(require("../routes/cart-routes"));
// importing error handler
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const app = (0, express_1.default)();
// middlewares
app.use(express_1.default.json());
const corsOptions = {
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use((0, cors_1.default)(corsOptions));
app.options("*", (0, cors_1.default)(corsOptions));
app.get("/", (req, res) => {
    res.json({ name: "Mario" });
});
// routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/books", book_routes_1.default);
app.use("/api/v1/order", order_routes_1.default);
app.use("/api/v1/cart", cart_routes_1.default);
app.use("/api/v1/dashboard", admin_routes_1.default);
// error handling
app.use(errorHandler_1.default);
// exporting app for server.ts
exports.default = app;
