import Policy from "../models/Policy.js";
import Claim from "../models/Claim.js";
import RiskAllocation from "../models/RiskAllocation.js";

// Get exposure by policy type
export const getExposureByType = async (req, res) => {
  const exposure = await Policy.aggregate([
    {
      $group: {
        _id: "$lineOfBusiness",
        totalExposure: { $sum: "$sumInsured" }
      }
    }
  ]);

  res.json(exposure);
};

// Get claims ratio
export const getClaimsRatio = async (req, res) => {
  const totalClaims = await Claim.aggregate([
    { $group: { _id: null, total: { $sum: "$claimAmount" } } }
  ]);

  const totalPremium = await Policy.aggregate([
    { $group: { _id: null, total: { $sum: "$premium" } } }
  ]);

  const ratio =
    (totalClaims[0]?.total || 0) /
    (totalPremium[0]?.total || 1);

  res.json({ claimsRatio: ratio });
};

// Get reinsurer-wise risk distribution
export const getReinsurerRiskDistribution = async (req, res) => {
  const distribution = await RiskAllocation.aggregate([
    { $unwind: "$allocations" },
    {
      $group: {
        _id: "$allocations.reinsurerId",
        totalAllocated: { $sum: "$allocations.allocatedAmount" }
      }
    }
  ]);

  res.json(distribution);
};