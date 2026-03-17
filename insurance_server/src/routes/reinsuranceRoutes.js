import express from "express";
import * as reinsuranceController from "../controllers/reinsuranceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import rbacMiddleware from "../middleware/rbacMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// Treaties
router.get('/treaties', reinsuranceController.getTreaties);
router.post('/treaties', rbacMiddleware(['REINSURANCE_MANAGER']), reinsuranceController.createTreaty);
// Risk allocations
router.get('/allocations/:policyId', reinsuranceController.getRiskAllocations);
router.post('/allocations', rbacMiddleware(['REINSURANCE_MANAGER']), reinsuranceController.allocateRisk);
// Reinsurers
router.get('/reinsurers', reinsuranceController.getReinsurers);
router.post('/reinsurers', rbacMiddleware(['REINSURANCE_MANAGER']), reinsuranceController.createReinsurer);

export default router;