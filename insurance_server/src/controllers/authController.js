import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Login handler
export const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: { id: user._id, username: user.username, role: user.role }
  });
};

// Register handler
export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    passwordHash,
    role
  });

  await user.save();

  res.status(201).json({
    message: "User created",
    user: { id: user._id, username, role }
  });
};