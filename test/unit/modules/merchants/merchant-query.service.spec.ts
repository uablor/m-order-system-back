import { NotFoundException } from '@nestjs/common';
import { MerchantQueryService } from '../../../../src/modules/merchants/services/merchant-query.service';
import { MerchantQueryRepository } from '../../../../src/modules/merchants/repositories/merchant.query-repository';
import { MerchantRepository } from '../../../../src/modules/merchants/repositories/merchant.repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

describe('MerchantQueryService', () => {
  let service: MerchantQueryService;
  let merchantRepository: Record<string, jest.Mock>;
  let merchantQueryRepository: {
    findWithPagination: jest.Mock;
    findMerchantDetail: jest.Mock;
  };
  let transactionService: { run: jest.Mock };

  const mockMerchant = {
    id: 1,
    ownerUserId: 10,
    shopName: 'ร้าน Test',
    shopLogoUrl: null,
    shopAddress: 'Bangkok',
    contactPhone: '0891234567',
    contactEmail: 'shop@test.com',
    contactFacebook: null,
    contactLine: null,
    contactWhatsapp: null,
    defaultCurrency: 'THB',
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  };

  beforeEach(() => {
    merchantRepository = {
      findOneById: jest.fn(),
    };
    merchantQueryRepository = {
      findWithPagination: jest.fn(),
      findMerchantDetail: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new MerchantQueryService(
      merchantRepository as unknown as MerchantRepository,
      merchantQueryRepository as unknown as MerchantQueryRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('getById', () => {
    it('ควร return merchant response เมื่อเจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(mockMerchant);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
      expect(result!.shopName).toBe('ร้าน Test');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร return wrapped response เมื่อเจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(mockMerchant);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      merchantQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockMerchant],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].shopName).toBe('ร้าน Test');
    });
  });

  describe('findMerchantDetail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      merchantQueryRepository.findMerchantDetail.mockResolvedValue(null);

      await expect(service.findMerchantDetail(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร return merchant detail ที่ถูกต้อง', async () => {
      merchantQueryRepository.findMerchantDetail.mockResolvedValue(mockMerchant);

      const result = await service.findMerchantDetail(10);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });
  });
});
