import { NotFoundException } from '@nestjs/common';
import { UserQueryService } from '../../../../src/modules/users/services/user-query.service';
import { UserQueryRepository } from '../../../../src/modules/users/repositories/user.query-repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

describe('UserQueryService', () => {
  let service: UserQueryService;
  let userQueryRepository: {
    repository: { findOne: jest.Mock };
    findWithPagination: jest.Mock;
  };
  let transactionService: { run: jest.Mock };

  const mockUser = {
    id: 1,
    email: 'user@test.com',
    fullName: 'Test User',
    roleId: 1,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
    lastLogin: null,
    role: { id: 1, roleName: 'ADMIN' },
  };

  beforeEach(() => {
    userQueryRepository = {
      repository: { findOne: jest.fn() },
      findWithPagination: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new UserQueryService(
      userQueryRepository as unknown as UserQueryRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('getById', () => {
    it('ควร return user response เมื่อเจอ', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(mockUser);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
      expect(result!.email).toBe('user@test.com');
      expect(result!.roleName).toBe('ADMIN');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร return wrapped response เมื่อเจอ', async () => {
      userQueryRepository.repository.findOne.mockResolvedValue(mockUser);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.results![0].id).toBe(1);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockUser],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.pagination.total).toBe(1);
    });

    it('ควรส่ง merchantId เมื่อระบุ', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({ page: 1, limit: 10 }, 5);

      expect(userQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: 5 }),
        mockManager,
      );
    });

    it('ควรจัดการ empty results ได้', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.results).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });

    it('ควรส่ง isActive=true filter ได้', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockUser],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({ page: 1, limit: 10, isActive: true });

      expect(userQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: true }),
        mockManager,
      );
    });

    it('ควรส่ง isActive=false filter ได้ (ไม่ถูกข้าม)', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({ page: 1, limit: 10, isActive: false });

      expect(userQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ isActive: false }),
        mockManager,
      );
    });

    it('ควรส่ง search parameter ได้', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockUser],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({ page: 1, limit: 10, search: 'test' });

      expect(userQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'test' }),
        mockManager,
      );
    });

    it('ควรส่ง date range filter ได้', async () => {
      userQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({
        page: 1, limit: 10,
        startDate: '2025-01-01', endDate: '2025-12-31',
      });

      expect(userQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          startDate: '2025-01-01',
          endDate: '2025-12-31',
        }),
        mockManager,
      );
    });
  });
});
