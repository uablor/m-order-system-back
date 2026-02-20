import { ConflictException, NotFoundException } from '@nestjs/common';
import { CustomerCommandService } from '../../../../src/modules/customers/services/customer-command.service';
import { CustomerRepository } from '../../../../src/modules/customers/repositories/customer.repository';
import { MerchantRepository } from '../../../../src/modules/merchants/repositories/merchant.repository';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';

const mockManager = {} as any;

describe('CustomerCommandService', () => {
  let service: CustomerCommandService;
  let customerRepository: Record<string, jest.Mock>;
  let merchantRepository: Record<string, jest.Mock>;
  let transactionService: { run: jest.Mock };

  beforeEach(() => {
    customerRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    merchantRepository = {
      findOneById: jest.fn(),
    };
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    service = new CustomerCommandService(
      customerRepository as unknown as CustomerRepository,
      merchantRepository as unknown as MerchantRepository,
      transactionService as unknown as TransactionService,
    );
  });

  describe('create', () => {
    const dto = {
      merchantId: 1,
      customerName: 'ลูกค้า Test',
      customerType: 'CUSTOMER' as const,
    };

    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(NotFoundException);
    });

    it('ควรสร้าง customer สำเร็จ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      customerRepository.findOneBy.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue({ id: 5 });

      const result = await service.create(dto);

      expect(result).toEqual({ id: 5 });
    });

    it('ควร throw ConflictException เมื่อ uniqueToken ซ้ำ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      customerRepository.findOneBy.mockResolvedValue({ id: 99 });

      await expect(
        service.create({
          ...dto,
          uniqueToken: 'existing-token',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('ควรสร้าง uniqueToken อัตโนมัติเมื่อไม่ระบุ', async () => {
      merchantRepository.findOneById.mockResolvedValue({ id: 1 });
      customerRepository.findOneBy.mockResolvedValue(null);
      customerRepository.create.mockResolvedValue({ id: 5 });

      await service.create(dto);

      const createArg = customerRepository.create.mock.calls[0][0];
      expect(createArg.uniqueToken).toBeDefined();
      expect(createArg.uniqueToken.length).toBeGreaterThan(0);
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา customer ไม่เจอ', async () => {
      customerRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.update(1, { customerName: 'New Name' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร throw ConflictException เมื่อ uniqueToken ซ้ำกับ customer อื่น', async () => {
      customerRepository.findOneById.mockResolvedValue({ id: 1 });
      customerRepository.findOneBy.mockResolvedValue({ id: 2 });

      await expect(
        service.update(1, { uniqueToken: 'dup-token' }),
      ).rejects.toThrow(ConflictException);
    });

    it('ควร update สำเร็จ', async () => {
      customerRepository.findOneById.mockResolvedValue({ id: 1 });
      customerRepository.update.mockResolvedValue(null);

      await service.update(1, { customerName: 'Updated Name' });

      expect(customerRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ customerName: 'Updated Name' }),
        mockManager,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา customer ไม่เจอ', async () => {
      customerRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      customerRepository.findOneById.mockResolvedValue({ id: 1 });
      customerRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(customerRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });
});
