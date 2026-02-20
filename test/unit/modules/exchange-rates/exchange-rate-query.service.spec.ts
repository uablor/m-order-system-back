import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExchangeRateQueryService } from '../../../../src/modules/exchange-rates/services/exchange-rate-query.service';
import { ExchangeRateQueryRepository } from '../../../../src/modules/exchange-rates/repositories/exchange-rate.query-repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

const mockManager = {} as any;

describe('ExchangeRateQueryService', () => {
  let service: ExchangeRateQueryService;
  let exchangeRateQueryRepository: {
    repository: { findOne: jest.Mock };
    findWithPagination: jest.Mock;
    findTodayRates: jest.Mock;
  };
  let transactionService: { run: jest.Mock };

  const mockRate = {
    id: 1,
    merchant: { id: 10 },
    baseCurrency: 'THB',
    targetCurrency: 'LAK',
    rateType: 'BUY',
    rate: '580.000000',
    isActive: true,
    rateDate: new Date('2025-06-15'),
    createdByUser: { id: 1 },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    exchangeRateQueryRepository = {
      repository: { findOne: jest.fn() },
      findWithPagination: jest.fn(),
      findTodayRates: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new ExchangeRateQueryService(
      exchangeRateQueryRepository as unknown as ExchangeRateQueryRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('getById', () => {
    it('ควร return rate เมื่อเจอ', async () => {
      exchangeRateQueryRepository.repository.findOne.mockResolvedValue(mockRate);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.baseCurrency).toBe('THB');
      expect(result!.rateType).toBe('BUY');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      exchangeRateQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      exchangeRateQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      exchangeRateQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockRate],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });

    it('ควรใช้ merchantId จาก currentUser เมื่อมี', async () => {
      exchangeRateQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const user: CurrentUserPayload = {
        userId: 1,
        email: 'a@b.com',
        roleId: 1,
        merchantId: 10,
      };

      await service.getList({ page: 1, limit: 10 }, user);

      expect(exchangeRateQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: 10 }),
        mockManager,
      );
    });
  });

  describe('getTodayRates', () => {
    it('ควร throw ForbiddenException เมื่อไม่มี merchantId', async () => {
      const user: CurrentUserPayload = {
        userId: 1,
        email: 'a@b.com',
        roleId: 1,
      };

      await expect(service.getTodayRates(user)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it('ควร return today rates', async () => {
      exchangeRateQueryRepository.findTodayRates.mockResolvedValue({
        buy: mockRate,
        sell: { ...mockRate, id: 2, rateType: 'SELL', rate: '590.000000' },
      });

      const user: CurrentUserPayload = {
        userId: 1,
        email: 'a@b.com',
        roleId: 1,
        merchantId: 10,
      };

      const result = await service.getTodayRates(user);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(2);
    });

    it('ควรจัดการเมื่อไม่มี rate วันนี้', async () => {
      exchangeRateQueryRepository.findTodayRates.mockResolvedValue({
        buy: null,
        sell: null,
      });

      const user: CurrentUserPayload = {
        userId: 1,
        email: 'a@b.com',
        roleId: 1,
        merchantId: 10,
      };

      const result = await service.getTodayRates(user);

      expect(result.results).toHaveLength(0);
    });
  });
});
