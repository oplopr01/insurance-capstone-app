import User from "../models/User.js";
import AuditLog from "../models/AuditLog.js";
import { logAction } from "../services/auditService.js";
import bcrypt from "bcryptjs";

// Get all users
export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Create user
export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const user = new User({ username, email, passwordHash, role });

  await user.save();

  await logAction({
    entityType: "USER",
    entityId: user._id,
    action: "CREATE",
    oldValue: null,
    newValue: { username, email, role },
    performedBy: req.user?._id,
    ipAddress: req.ip
  });

  res.status(201).json(user);
};

// Update user
export const updateUser = async (req, res) => {
  const oldUser = await User.findById(req.params.id);

  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  if (!user) return res.status(404).json({ message: "User not found" });

  await logAction({
    entityType: "USER",
    entityId: user._id,
    action: "UPDATE",
    oldValue: oldUser,
    newValue: req.body,
    performedBy: req.user?._id,
    ipAddress: req.ip
  });

  res.json(user);
};

// Delete user
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) return res.status(404).json({ message: "User not found" });

  await logAction({
    entityType: "USER",
    entityId: req.params.id,
    action: "DELETE",
    oldValue: user,
    newValue: null,
    performedBy: req.user?._id,
    ipAddress: req.ip
  });

  res.json({ message: "User deleted" });
};

// Get audit logs
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate("performedBy", "username email")
      .sort({ performedAt: -1 })
      .limit(500);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};