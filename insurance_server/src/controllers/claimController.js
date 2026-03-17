import Claim from "../models/Claim.js";
import Policy from "../models/Policy.js";
import { logAction } from "../services/auditService.js";

// Submit claim
export const createClaim = async (req, res) => {
  const { policyId, claimAmount, incidentDate, reportedDate, remarks } = req.body;

  const policy = await Policy.findById(policyId);

  if (!policy) {
    return res.status(404).json({ message: "Policy not found" });
  }

  if (policy.status !== "ACTIVE") {
    return res.status(400).json({ message: "Only ACTIVE policies can have claims filed" });
  }

  if (claimAmount > policy.sumInsured) {
    return res.status(400).json({
      message: `Claim amount ($${claimAmount}) cannot exceed policy coverage ($${policy.sumInsured})`
    });
  }

  const claimNumber = "CLM" + Date.now();

  const claim = new Claim({
    claimNumber,
    policyId,
    claimAmount,
    status: "SUBMITTED",
    incidentDate,
    reportedDate,
    remarks,
    handledBy: req.user._id
  });

  await claim.save();

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "CREATE",
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.status(201).json(claim);
};

// Get all claims
export const getClaims = async (req, res) => {
  const claims = await Claim.find().populate("policyId handledBy");
  res.json(claims);
};

// Get claim by ID
export const getClaimById = async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate("policyId handledBy");

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  res.json(claim);
};

// Review claim
export const reviewClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  const oldValue = { ...claim.toObject() };

  claim.status = "IN_REVIEW";

  await claim.save();

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "UPDATE",
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.json(claim);
};

// Approve claim
export const approveClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id).populate("policyId");

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  if (claim.status !== "IN_REVIEW") {
    return res.status(400).json({ message: "Only IN_REVIEW claims can be approved" });
  }

  const approvedAmount = req.body.approvedAmount || claim.claimAmount;

  if (approvedAmount > claim.claimAmount) {
    return res.status(400).json({
      message: `Approved amount ($${approvedAmount}) cannot exceed claim amount ($${claim.claimAmount})`
    });
  }

  if (approvedAmount > claim.policyId.sumInsured) {
    return res.status(400).json({
      message: `Approved amount ($${approvedAmount}) exceeds policy coverage ($${claim.policyId.sumInsured})`
    });
  }

  const oldValue = { ...claim.toObject() };

  claim.status = "APPROVED";
  claim.approvedAmount = approvedAmount;

  await claim.save();

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "APPROVE",
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.json(claim);
};

// Reject claim
export const rejectClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  const oldValue = { ...claim.toObject() };

  claim.status = "REJECTED";

  await claim.save();

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "UPDATE",
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.json(claim);
};

// Settle claim
export const settleClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id);

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  const oldValue = { ...claim.toObject() };

  claim.status = "SETTLED";

  await claim.save();

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "UPDATE",
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.json(claim);
};

// Update claim
export const updateClaim = async (req, res) => {
  const oldValue = await Claim.findById(req.params.id);

  const claim = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "UPDATE",
    oldValue,
    newValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.json(claim);
};

// Delete claim
export const deleteClaim = async (req, res) => {
  const claim = await Claim.findByIdAndDelete(req.params.id);

  if (!claim) return res.status(404).json({ message: "Claim not found" });

  await logAction({
    entityType: "CLAIM",
    entityId: claim._id,
    action: "DELETE",
    oldValue: claim,
    performedBy: req.user._id,
    ipAddress: req.ip
  });

  res.json({ message: "Claim deleted" });
};