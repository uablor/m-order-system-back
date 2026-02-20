import { NotFoundException } from '@nestjs/common';
import { MerchantCommandService } from '../../../../src/modules/merchants/services/merchant-command.service';
import { MerchantRepository } from '../../../../src/modules/merchants/repositories/merchant.repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

describe('MerchantCommandService', () => {
  let service: MerchantCommandService;
  let merchantRepository: Record<string, jest.Mock>;
  let transactionService: { run: jest.Mock };

  beforeEach(() => {
    merchantRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new MerchantCommandService(
      merchantRepository as unknown as MerchantRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('create', () => {
    it('ควรสร้าง merchant สำเร็จ', async () => {
      merchantRepository.create.mockResolvedValue({ id: 1 });

      const result = await service.create(1, {
        shopName: 'ร้าน Test',
        contactPhone: '0891234567',
      });

      expect(result).toEqual({ id: 1 });
      expect(merchantRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ownerUserId: 1,
          shopName: 'ร้าน Test',
          contactPhone: '0891234567',
          defaultCurrency: 'THB',
          isActive: true,
        }),
        mockManager,
      );
    });

    it('ควรใช้ default currency THB เมื่อไม่ระบุ', async () => {
      merchantRepository.create.mockResolvedValue({ id: 1 });

      await service.create(1, { shopName: 'Shop' });

      const createArg = merchantRepository.create.mock.calls[0][0];
      expect(createArg.defaultCurrency).toBe('THB');
    });

    it('ควรรับ custom currency ได้', async () => {
      merchantRepository.create.mockResolvedValue({ id: 1 });

      await service.create(1, { shopName: 'Shop', defaultCurrency: 'LAK' as any });

      const createArg = merchantRepository.create.mock.calls[0][0];
      expect(createArg.defaultCurrency).toBe('LAK');
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(service.update(1, { shopName: 'New Name' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร update สำเร็จ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      merchantRepository.update.mockResolvedValue(null);

      await service.update(1, { shopName: 'Updated Shop' });

      expect(merchantRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ shopName: 'Updated Shop' }),
        mockManager,
      );
    });

    it('ควร update เฉพาะ field ที่ส่งมา', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      merchantRepository.update.mockResolvedValue(null);

      await service.update(1, { contactPhone: '0999999999' });

      const updateArg = merchantRepository.update.mock.calls[0][1];
      expect(updateArg.contactPhone).toBe('0999999999');
      expect(updateArg.shopName).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      merchantRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(merchantRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });
});
