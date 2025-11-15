import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";

// Create an express app
const app = express();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin : process.env.FRONTEND_URL || "http://localhost:5173",
    credentials : true,
}));

app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/food", foodRoutes);

// Throw a response 
app.get('/', (req, res) => {
    res.send("ResQFood app is live !");
});

export default app;