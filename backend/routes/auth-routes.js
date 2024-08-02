"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// controllers
var auth_controllers_1 = require("../controllers/auth-controllers");
var router = (0, express_1.Router)();
// routes
router.post("/register", auth_controllers_1.register);
router.post("/login", auth_controllers_1.login);
exports.default = router;
