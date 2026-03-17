import express from "express";
import * as dashboardController from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get('/exposure', dashboardController.getExposureByType);
router.get('/claims-ratio', dashboardController.getClaimsRatio);
router.get('/reinsurer-risk', dashboardController.getReinsurerRiskDistribution);

export default router;