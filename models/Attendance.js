import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // using string for easy comparison (e.g. "2025-11-06")
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      default: "Present",
    },
  },
  { timestamps: true }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);
export default Attendance;
