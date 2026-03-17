import mongoose from "mongoose";
import Policy from "../models/Policy.js";
import User from "../models/User.js";
import Treaty from "../models/Treaty.js";
import RiskAllocation from "../models/RiskAllocation.js";
import { logAction } from "../services/auditService.js";

// Create policy
export const createPolicy = async (req, res) => {
  const {
    insuredName,
    insuredType,
    lineOfBusiness,
    sumInsured,
    premium,
    retentionLimit,
    effectiveFrom,
    effectiveTo,
  } = req.body;

  const policyNumber = "POL" + Date.now();

  const policy = new Policy({
    policyNumber,
    insuredName,
    insuredType,
    lineOfBusiness,
    sumInsured,
    premium,
    retentionLimit,
    status: "DRAFT",
    effectiveFrom,
    effectiveTo,
    createdBy: req.user._id,
  });

  await policy.save();

  await logAction({
    entityType: "POLICY",
    entityId: policy._id,
    action: "CREATE",
    newValue: policy,
    performedBy: req.user._id,
    ipAddress: req.ip,
  });

  res.status(201).json(policy);
};

// Get policies
export const getPolicies = async (req, res) => {
  let query = {};

  if (req.user.role === "UNDERWRITER") {
    let userId = req.user._id;

    if (typeof userId === "string") {
      userId = new mongoose.Types.ObjectId(userId);
    }

    query = { createdBy: userId };
  }

  const policies = await Policy.find(query).populate("createdBy approvedBy");

  res.json(policies);
};

// Get policy by id
export const getPolicyById = async (req, res) => {
  const policy = await Policy.findById(req.params.id).populate(
    "createdBy approvedBy"
  );

  if (!policy) return res.status(404).json({ message: "Policy not found" });

  res.json(policy);
};

// Submit policy
export const submitPolicy = async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (!policy) return res.status(404).json({ message: "Policy not found" });

  if (policy.status !== "DRAFT") {
    return res.status(400).json({ message: "Only DRAFT policies can be submitted." });
  }

  const oldValue = { ...policy.toObject() };

  policy.status = "SUBMITTED";

  await policy.save();

  await logAction({
    entityType: "POLICY",
    entityId: policy._id,
    action: "UPDATE",
    oldValue,
    newValue: policy,
    performedBy: req.user._id,
    ipAddress: req.ip,
  });

  res.json(policy);
};

// Approve policy
export const approvePolicy = async (req, res) => {
  const policy = await Policy.findById(req.params.id);

  if (!policy) return res.status(404).json({ message: "Policy not found" });

  if (policy.status !== "SUBMITTED") {
    return res.status(400).json({ message: "Only SUBMITTED policies can be approved." });
  }

  const oldValue = { ...policy.toObject() };

  policy.status = "ACTIVE";
  policy.approvedBy = req.user._id;

  await policy.save();

  if (policy.sumInsured > policy.retentionLimit) {
    const treaties = await Treaty.find({
      retentionLimit: { $lte: policy.sumInsured },
      applicableLOBs: policy.lineOfBusiness,
      status: "ACTIVE",
    }).sort({ sharePercentage: -1 });

    const cededAmount = Math.max(0, policy.sumInsured - policy.retentionLimit);

    let remainingCeded = cededAmount;

    const allocations = [];

    for (const t of treaties) {
      if (remainingCeded <= 0) break;

      const sharePct = Number(t.sharePercentage || 0);

      let desired = (cededAmount * sharePct) / 100;

      if (typeof t.treatyLimit === "number" && isFinite(t.treatyLimit)) {
        desired = Math.min(desired, t.treatyLimit);
      }

      const allocated = Math.min(desired, remainingCeded);

      if (allocated <= 0) continue;

      const allocatedPctOfSum = Number(
        ((allocated / policy.sumInsured) * 100).toFixed(2)
      );

      allocations.push({
        reinsurerId: t.reinsurerId,
        treatyId: t._id,
        allocatedAmount: allocated,
        allocatedPercentage: allocatedPctOfSum,
      });

      remainingCeded -= allocated;
    }

    const totalAllocated = allocations.reduce(
      (s, a) => s + (a.allocatedAmount || 0),
      0
    );

    const retainedAmount = policy.sumInsured - totalAllocated;

    await RiskAllocation.create({
      policyId: policy._id,
      allocations,
      retainedAmount,
      calculatedBy: req.user._id,
    });
  }

  await logAction({
    entityType: "POLICY",
    entityId: policy._id,
    action: "APPROVE",
    oldValue,
    newValue: policy,
    performedBy: req.user._id,
    ipAddress: req.ip,
  });

  res.json(policy);
};

// Update policy
export const updatePolicy = async (req, res) => {
  const oldValue = await Policy.findById(req.params.id);

  const policy = await Policy.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  if (!policy) return res.status(404).json({ message: "Policy not found" });

  await logAction({
    entityType: "POLICY",
    entityId: policy._id,
    action: "UPDATE",
    oldValue,
    newValue: policy,
    performedBy: req.user._id,
    ipAddress: req.ip,
  });

  res.json(policy);
};

// Delete policy
export const deletePolicy = async (req, res) => {
  const policy = await Policy.findByIdAndDelete(req.params.id);

  if (!policy) return res.status(404).json({ message: "Policy not found" });

  await logAction({
    entityType: "POLICY",
    entityId: policy._id,
    action: "DELETE",
    oldValue: policy,
    performedBy: req.user._id,
    ipAddress: req.ip,
  });

  res.json({ message: "Policy deleted" });
};