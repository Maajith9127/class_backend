import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

// Temporary in-memory store (no DB)
let currentQRCode = null;

// ✅ Teacher starts attendance
export const startAttendance = async (req, res) => {
  try {
    const { qrCode } = req.body;
    if (!qrCode)
      return res.status(400).json({ message: "QR code is required" });

    currentQRCode = qrCode;
    console.log("🎯 Active QR set to:", qrCode);
    res.json({ message: "Attendance session started", qrCode });
  } catch (err) {
    console.error("Error in startAttendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Student marks attendance
export const markAttendance = async (req, res) => {
  try {
    const { userId, scannedCode } = req.body;

    if (!currentQRCode)
      return res.status(400).json({ message: "No active attendance session" });

    if (scannedCode !== currentQRCode)
      return res.status(400).json({ message: "Invalid or expired QR code" });

    // ✅ Fix timezone issue (local date, not UTC)
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const date = now.toISOString().split("T")[0];

    // ✅ Prevent duplicate marking
    const alreadyMarked = await Attendance.findOne({ userId, date });
    if (alreadyMarked)
      return res.json({ message: "Already marked present for today" });

    // Store exact time too (for analytics)
    await Attendance.create({
      userId,
      date,
      status: "Present",
      markedAt: now.toISOString(),
    });

    console.log(` Attendance marked for user ${userId} on ${date}`);
    res.json({ message: "Attendance marked successfully!" });
  } catch (err) {
    console.error("Error in markAttendance:", err);
    res.status(500).json({ message: "Server error" });
  }
};


//  Teacher stops attendance
export const stopAttendance = async (req, res) => {
  currentQRCode = null;
  res.json({ message: "Attendance session stopped" });
};

//  Student fetches attendance by date
export const getAttendanceByDate = async (req, res) => {
  try {
    const { userId, date } = req.params;
    console.log("Fetching attendance for:", userId, date);

    const record = await Attendance.findOne({ userId, date });
    if (!record) {
      return res.status(404).json({ message: "No record found for this date" });
    }

    res.json({ message: "Record fetched", data: record });
  } catch (err) {
    console.error("Error fetching attendance:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

//  Teacher fetches ALL students' attendance by date
// export const getAllAttendanceByDate = async (req, res) => {
//   try {
//     const { date } = req.params;

//     if (!date) {
//       return res.status(400).json({ message: "Date is required" });
//     }

//     const records = await Attendance.find({ date });

//     if (records.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No records found for this date" });
//     }

//     res.json({
//       message: "Attendance records fetched successfully",
//       data: records,
//     });
//   } catch (err) {
//     console.error("Error in getAllAttendanceByDate:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };


// ✅ Teacher fetches ALL students' attendance by date
export const getAllAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Populate user email instead of returning only userId
    const records = await Attendance.find({ date })
      .populate("userId", "email") // only fetch 'email' field
      .lean();

    if (records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this date" });
    }

    // Simplify output (optional)
    const formatted = records.map((r) => ({
      email: r.userId?.email || "Unknown",
      status: r.status,
      date: r.date,
    }));

    res.json({
      message: "Attendance records fetched successfully",
      data: formatted,
    });
  } catch (err) {
    console.error("Error in getAllAttendanceByDate:", err);
    res.status(500).json({ message: "Server error" });
  }
};
