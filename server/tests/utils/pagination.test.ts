// ============================================
// Pagination Helper Tests
// ============================================

import { parsePagination, parseSort, buildPaginationMeta } from '../../src/utils/pagination';
import { Request } from 'express';

function mockRequest(query: Record<string, string> = {}): Request {
  return { query } as unknown as Request;
}

describe('Pagination Helpers', () => {
  describe('parsePagination', () => {
    it('should return defaults when no query params', () => {
      const result = parsePagination(mockRequest());
      expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
    });

    it('should parse page and limit', () => {
      const result = parsePagination(mockRequest({ page: '3', limit: '10' }));
      expect(result).toEqual({ page: 3, limit: 10, skip: 20 });
    });

    it('should enforce minimum page of 1', () => {
      const result = parsePagination(mockRequest({ page: '-5' }));
      expect(result.page).toBe(1);
    });

    it('should enforce maximum limit of 100', () => {
      const result = parsePagination(mockRequest({ limit: '500' }));
      expect(result.limit).toBe(100);
    });

    it('should fallback to default when limit is 0', () => {
      const result = parsePagination(mockRequest({ limit: '0' }));
      expect(result.limit).toBe(20);
    });

    it('should handle non-numeric values gracefully', () => {
      const result = parsePagination(mockRequest({ page: 'abc', limit: 'xyz' }));
      expect(result).toEqual({ page: 1, limit: 20, skip: 0 });
    });
  });

  describe('parseSort', () => {
    const allowed = ['createdAt', 'sortOrder', 'name'];

    it('should return default sort when no query params', () => {
      const result = parseSort(mockRequest(), allowed);
      expect(result).toEqual({ sortBy: 'createdAt', order: 'desc' });
    });

    it('should parse valid sort field', () => {
      const result = parseSort(mockRequest({ sort: 'name', order: 'asc' }), allowed);
      expect(result).toEqual({ sortBy: 'name', order: 'asc' });
    });

    it('should fall back to default for invalid sort field', () => {
      const result = parseSort(mockRequest({ sort: 'sql_injection' }), allowed);
      expect(result.sortBy).toBe('createdAt');
    });

    it('should default to desc for invalid order', () => {
      const result = parseSort(mockRequest({ order: 'invalid' }), allowed);
      expect(result.order).toBe('desc');
    });

    it('should use custom default sort', () => {
      const result = parseSort(mockRequest(), allowed, 'sortOrder');
      expect(result.sortBy).toBe('sortOrder');
    });
  });

  describe('buildPaginationMeta', () => {
    it('should build correct meta', () => {
      const meta = buildPaginationMeta(95, { page: 2, limit: 20, skip: 20 });
      expect(meta).toEqual({
        page: 2,
        limit: 20,
        total: 95,
        totalPages: 5,
      });
    });

    it('should handle zero total', () => {
      const meta = buildPaginationMeta(0, { page: 1, limit: 20, skip: 0 });
      expect(meta.totalPages).toBe(0);
      expect(meta.total).toBe(0);
    });

    it('should handle exact page boundary', () => {
      const meta = buildPaginationMeta(40, { page: 1, limit: 20, skip: 0 });
      expect(meta.totalPages).toBe(2);
    });
  });
});
