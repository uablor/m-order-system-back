import {
  createResponse,
  createSingleResponse,
  createPaginatedResponse,
  DEFAULT_SUCCESS_CODE,
  DEFAULT_SUCCESS_MESSAGE,
} from '../../../../src/common/base/helpers/response.helper';

describe('Response Helper', () => {
  describe('createResponse', () => {
    it('ควรสร้าง response สำหรับ array ได้ถูกต้อง', () => {
      const items = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
      const result = createResponse(items);

      expect(result).toEqual({
        success: true,
        Code: DEFAULT_SUCCESS_CODE,
        message: DEFAULT_SUCCESS_MESSAGE,
        results: items,
      });
    });

    it('ควรใช้ message ที่กำหนดเองได้', () => {
      const result = createResponse([], 'Custom message');

      expect(result.message).toBe('Custom message');
    });

    it('ควรใช้ Code ที่กำหนดเองได้', () => {
      const result = createResponse([], 'msg', 201);

      expect(result.Code).toBe(201);
    });

    it('ควรจัดการ empty array ได้', () => {
      const result = createResponse([]);

      expect(result.results).toEqual([]);
      expect(result.success).toBe(true);
    });
  });

  describe('createSingleResponse', () => {
    it('ควร wrap single item ใน array ได้ถูกต้อง', () => {
      const item = { id: 1, name: 'Test' };
      const result = createSingleResponse(item);

      expect(result.results).toEqual([item]);
      expect(result.success).toBe(true);
      expect(result.Code).toBe(DEFAULT_SUCCESS_CODE);
      expect(result.message).toBe(DEFAULT_SUCCESS_MESSAGE);
    });

    it('ควรรับ custom message ได้', () => {
      const result = createSingleResponse({ id: 1 }, 'Found it');

      expect(result.message).toBe('Found it');
    });
  });

  describe('createPaginatedResponse', () => {
    it('ควรสร้าง paginated response ได้ถูกต้อง', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const pagination = {
        total: 20,
        page: 1,
        limit: 10,
        totalPages: 2,
        hasNextPage: true,
        hasPreviousPage: false,
      };

      const result = createPaginatedResponse(items, pagination);

      expect(result).toEqual({
        success: true,
        Code: DEFAULT_SUCCESS_CODE,
        message: DEFAULT_SUCCESS_MESSAGE,
        results: items,
        pagination,
      });
    });

    it('ควรจัดการหน้าสุดท้ายได้', () => {
      const pagination = {
        total: 5,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      };

      const result = createPaginatedResponse([{ id: 1 }], pagination);

      expect(result.pagination.hasNextPage).toBe(false);
      expect(result.pagination.hasPreviousPage).toBe(false);
    });
  });
});
