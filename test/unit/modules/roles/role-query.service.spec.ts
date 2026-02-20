import { NotFoundException } from '@nestjs/common';
import { RoleQueryService } from '../../../../src/modules/roles/services/role-query.service';
import { RoleQueryRepository } from '../../../../src/modules/roles/repositories/role.query-repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

describe('RoleQueryService', () => {
  let service: RoleQueryService;
  let roleQueryRepository: {
    repository: { findOne: jest.Mock };
    findWithPagination: jest.Mock;
  };
  let transactionService: { run: jest.Mock };

  const mockRole = {
    id: 1,
    roleName: 'ADMIN',
    description: 'Administrator role',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    roleQueryRepository = {
      repository: { findOne: jest.fn() },
      findWithPagination: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new RoleQueryService(
      roleQueryRepository as unknown as RoleQueryRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('getById', () => {
    it('ควร return role เมื่อเจอ', async () => {
      roleQueryRepository.repository.findOne.mockResolvedValue(mockRole);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.roleName).toBe('ADMIN');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      roleQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      roleQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      roleQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockRole],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].roleName).toBe('ADMIN');
    });
  });
});
