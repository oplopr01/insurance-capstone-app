import AuditLog from "../models/AuditLog.js";

export const logAction = async ({
  entityType,
  entityId,
  action,
  oldValue,
  newValue,
  performedBy,
  ipAddress
}) => {
  const log = new AuditLog({
    entityType,
    entityId,
    action,
    oldValue,
    newValue,
    performedBy,
    ipAddress,
    performedAt: new Date()
  });

  await log.save();
};