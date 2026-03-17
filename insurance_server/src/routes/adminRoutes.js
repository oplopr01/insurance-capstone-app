import express from "express";
import * as adminController from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import rbacMiddleware from "../middleware/rbacMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

// User management
router.get('/users', rbacMiddleware(['ADMIN']), adminController.getUsers);
router.post('/users', rbacMiddleware(['ADMIN']), adminController.createUser);
router.put('/users/:id', rbacMiddleware(['ADMIN']), adminController.updateUser);
router.delete('/users/:id', rbacMiddleware(['ADMIN']), adminController.deleteUser);

// Audit logs
router.get('/audit-logs', rbacMiddleware(['ADMIN']), adminController.getAuditLogs);

export default router;
