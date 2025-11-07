// import User from "../models/User.js";

// //  Register user
// export const registerUser = async (req, res) => {
//   try {
//     const { email, password, role } = req.body;

//     if (!email || !password || !role)
//       return res.status(400).json({ message: "All fields are required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const newUser = await User.create({ email, password, role });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: { email: newUser.email, role: newUser.role },
//     });
//   } catch (error) {
//     console.error("Error in registerUser:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Login user
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     if (user.password !== password)
//       return res.status(401).json({ message: "Invalid password" });

//     res.json({
//       message: "Login successful",
//       user: { email: user.email, role: user.role },
//     });
//   } catch (error) {
//     console.error("Error in loginUser:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };



import User from "../models/User.js";

// ✅ Register user
export const registerUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const newUser = await User.create({ email, password, role });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
