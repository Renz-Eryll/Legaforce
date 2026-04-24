import prisma from "../config/database.js";

/**
 * Log an administrative or system action
 * @param {Object} params
 * @param {string} params.userId - ID of the user performing the action
 * @param {string} params.action - The action type (e.g. UPDATE_STATUS)
 * @param {string} params.entityType - The entity being affected (e.g. APPLICATION)
 * @param {string} params.entityId - The ID of the affected record
 * @param {string} params.description - Human readable description
 * @param {Object} [params.metadata] - Optional: store old/new values
 * @param {string} [params.ipAddress] - The requester's IP
 */
export const logAction = async ({
  userId,
  action,
  entityType,
  entityId,
  description,
  metadata = null,
  ipAddress = null,
}) => {
  try {
    if (!prisma.auditLog) {
      console.warn("AuditLog model missing on prisma client. Action not logged.");
      return;
    }
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entityType,
        entityId,
        description,
        metadata,
        ipAddress,
      },
    });
  } catch (err) {
    console.error("CRITICAL: Failed to write audit log:", err.message);
  }
};

export const getAuditLogs = async (filters = {}) => {
  if (!prisma.auditLog) return [];
  
  const { entityType, entityId, userId, limit = 100 } = filters;
  const where = {};
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  if (userId) where.userId = userId;

  return prisma.auditLog.findMany({
    where,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { email: true, role: true } },
    },
  });
};
