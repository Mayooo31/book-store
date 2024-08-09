import express, { Request, Response } from "express";
import cors from "cors";
// importing routes
import authRoutes from "../routes/auth-routes";
import bookRoutes from "../routes/book-routes";
import orderRoutes from "../routes/order-routes";
import adminRoutes from "../routes/admin-routes";
import cartRoutes from "../routes/cart-routes";
// importing error handler
import errorHandler from "../utils/errorHandler";

const app = express();

// middlewares
app.use(express.json());
const corsOptions = {
  origin: "*",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.json({ name: "Mario" });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/dashboard", adminRoutes);

// error handling
app.use(errorHandler);

// exporting app for server.ts
export default app;
