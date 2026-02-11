// ============================================
// Pagination & Sorting Helpers
// ============================================

import { Request } from 'express';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface SortParams {
  sortBy: string;
  order: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Extract pagination params from query string.
 * Defaults: page=1, limit=20, max limit=100.
 */
export function parsePagination(req: Request): PaginationParams {
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Extract sort params from query string.
 * @param allowedFields - list of allowed sort fields to prevent injection
 * @param defaultSort - default sort field
 */
export function parseSort(
  req: Request,
  allowedFields: string[],
  defaultSort = 'createdAt',
): SortParams {
  const sortBy = allowedFields.includes(req.query.sort as string)
    ? (req.query.sort as string)
    : defaultSort;
  const order = req.query.order === 'asc' ? 'asc' : 'desc';
  return { sortBy, order };
}

/**
 * Build pagination meta for response envelope.
 */
export function buildPaginationMeta(total: number, params: PaginationParams): PaginationMeta {
  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages: Math.ceil(total / params.limit),
  };
}
