import mongoose from "mongoose";

const riskAllocationSchema = new mongoose.Schema({
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Policy",
    required: true
  },
  allocations: [
    {
      reinsurerId: { type: mongoose.Schema.Types.ObjectId, ref: "Reinsurer" },
      treatyId: { type: mongoose.Schema.Types.ObjectId, ref: "Treaty" },
      allocatedAmount: { type: Number },
      allocatedPercentage: { type: Number }
    }
  ],
  retainedAmount: { type: Number },
  calculatedAt: { type: Date, default: Date.now },
  calculatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const RiskAllocation = mongoose.model("RiskAllocation", riskAllocationSchema);

export default RiskAllocation;