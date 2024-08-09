import { Router } from "express";
// controllers
import { login, register } from "../controllers/auth-controllers";

const router = Router();

// routes
router.post("/register", register);
router.post("/login", login);

export default router;
