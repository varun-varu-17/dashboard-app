import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import userRoutes from "./routes/user.routes.js";



const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.static("src/public"));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use(errorHandler);

export default app;
