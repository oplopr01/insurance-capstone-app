import Treaty from "../models/Treaty.js";
import RiskAllocation from "../models/RiskAllocation.js";
import Policy from "../models/Policy.js";
import Reinsurer from "../models/Reinsurer.js";

// Create reinsurer
export const createReinsurer = async (req, res) => {
  try {
    const { name, contact, email } = req.body;

    if (!name || !contact || !email) {
      return res.status(400).json({
        message: "Name, contact, and email are required."
      });
    }

    const code = name.replace(/\s+/g, "").toUpperCase();

    const reinsurer = await Reinsurer.create({
      name,
      code,
      contactEmail: email,
      status: "ACTIVE"
    });

    res.status(201).json(reinsurer);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Reinsurer code or name already exists."
      });
    }

    res.status(500).json({
      message: "Failed to create reinsurer",
      error: err.message
    });
  }
};

// Get all treaties
export const getTreaties = async (req, res) => {
  const treaties = await Treaty.find().populate("reinsurerId");
  res.json(treaties);
};

// Create treaty
export const createTreaty = async (req, res) => {
  const treaty = new Treaty(req.body);
  await treaty.save();
  res.status(201).json(treaty);
};

// Get risk allocations
export const getRiskAllocations = async (req, res) => {
  const allocations = await RiskAllocation.find({
    policyId: req.params.policyId
  }).populate("allocations.reinsurerId allocations.treatyId");

  res.json(allocations);
};

// Allocate risk
export const allocateRisk = async (req, res) => {
  const { policyId, allocations, retainedAmount } = req.body;

  const riskAllocation = new RiskAllocation({
    policyId,
    allocations,
    retainedAmount,
    calculatedBy: req.user._id
  });

  await riskAllocation.save();

  res.status(201).json(riskAllocation);
};

// Get reinsurers
export const getReinsurers = async (req, res) => {
  const reinsurers = await Reinsurer.find();
  res.json(reinsurers);
};