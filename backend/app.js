import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import insightRoutes from "./routes/insightRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/insights", insightRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "LifeOS AI Backend is running 🚀",
  });
});

export default app;