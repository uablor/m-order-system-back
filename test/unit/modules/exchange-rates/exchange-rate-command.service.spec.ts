import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ExchangeRateCommandService } from '../../../../src/modules/exchange-rates/services/exchange-rate-command.service';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

const mockManager = {} as any;

describe('ExchangeRateCommandService', () => {
  let service: ExchangeRateCommandService;
  let transactionService: { run: jest.Mock };
  let exchangeRateRepository: Record<string, jest.Mock>;
  let merchantRepository: Record<string, jest.Mock>;
  let cacheManager: { del: jest.Mock; store: { keys: jest.Mock } };

  const currentUser: CurrentUserPayload = {
    userId: 1,
    email: 'admin@test.com',
    roleId: 1,
    roleName: 'ADMIN',
    merchantId: 10,
  };

  beforeEach(() => {
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };
    exchangeRateRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getRepo: jest.fn().mockReturnValue({ update: jest.fn() }),
    };
    merchantRepository = {
      findOneById: jest.fn(),
    };
    cacheManager = {
      del: jest.fn(),
      store: {
        keys: jest.fn().mockResolvedValue([]),
      },
    };

    service = new ExchangeRateCommandService(
      transactionService as unknown as TransactionService,
      exchangeRateRepository as any,
      merchantRepository as any,
      cacheManager as any,
    );
  });

  describe('create', () => {
    const dto = {
      baseCurrency: 'THB',
      targetCurrency: 'LAK',
      rateType: 'BUY' as const,
      rate: 580,
    };

    it('ควร throw ForbiddenException เมื่อ user ไม่มี merchantId', async () => {
      const userNoMerchant = { ...currentUser, merchantId: undefined };

      await expect(
        service.create(dto, userNoMerchant),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(service.create(dto, currentUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควรสร้าง exchange rate สำเร็จ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 10 });
      exchangeRateRepository.create.mockResolvedValue({ id: 1 });

      const result = await service.create(dto, currentUser);

      expect(result).toEqual({ id: 1 });
      expect(exchangeRateRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rateType: 'BUY',
          rate: '580',
          isActive: true,
        }),
        mockManager,
      );
    });

    it('ควร deactivate exchange rate เก่าก่อนสร้างใหม่', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 10 });
      exchangeRateRepository.create.mockResolvedValue({ id: 1 });
      const mockRepoUpdate = jest.fn();
      exchangeRateRepository.getRepo.mockReturnValue({ update: mockRepoUpdate });

      await service.create(dto, currentUser);

      expect(mockRepoUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          merchant: { id: 10 },
          rateType: 'BUY',
          isActive: true,
        }),
        { isActive: false },
      );
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา rate ไม่เจอ', async () => {
      exchangeRateRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.update(1, { rate: 600 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร update สำเร็จ', async () => {
      exchangeRateRepository.findOneById.mockResolvedValue({ id: 1 });
      exchangeRateRepository.update.mockResolvedValue(null);

      await service.update(1, { rate: 600 });

      expect(exchangeRateRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ rate: '600' }),
        mockManager,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา rate ไม่เจอ', async () => {
      exchangeRateRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      exchangeRateRepository.findOneById.mockResolvedValue({ id: 1 });
      exchangeRateRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(exchangeRateRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });

  describe('createMany', () => {
    it('ควร throw ForbiddenException เมื่อไม่มี merchantId', async () => {
      const userNoMerchant = { ...currentUser, merchantId: undefined };

      await expect(
        service.createMany({ items: [] }, userNoMerchant),
      ).rejects.toThrow(ForbiddenException);
    });

    it('ควรสร้างหลาย rates สำเร็จ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 10 });
      const mockRepoUpdate = jest.fn();
      exchangeRateRepository.getRepo.mockReturnValue({ update: mockRepoUpdate });
      exchangeRateRepository.create
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 });

      const result = await service.createMany(
        {
          items: [
            { baseCurrency: 'THB', targetCurrency: 'LAK', rateType: 'BUY' as any, rate: 580 },
            { baseCurrency: 'THB', targetCurrency: 'LAK', rateType: 'SELL' as any, rate: 590 },
          ],
        },
        currentUser,
      );

      expect(result).toEqual({ ids: [1, 2] });
    });
  });
});
