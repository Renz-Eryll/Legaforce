/**
 * Parse `page` / `limit` query params into safe Prisma pagination values.
 * Guards against NaN (e.g. ?page=abc) and unbounded page sizes (e.g. ?limit=100000).
 */
export const getPagination = (query = {}, { defaultLimit = 20, maxLimit = 100 } = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
};
