import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// ✅ Import Controllers
import {
  startAttendance,
  markAttendance,
  stopAttendance,
  getAttendanceByDate,
  getAllAttendanceByDate,
} from "./controllers/attendanceController.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Attendance Routes
app.post("/api/attendance/start", startAttendance);
app.post("/api/attendance/mark", markAttendance);
app.post("/api/attendance/stop", stopAttendance);

// ✅ Teacher route FIRST (avoid 'CastError: all')
app.get("/api/attendance/all/:date", getAllAttendanceByDate);

// ✅ Student route AFTER
app.get("/api/attendance/:userId/:date", getAttendanceByDate);

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("🎯 Attendance Backend Running Successfully!");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
