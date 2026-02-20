import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ArrivalCommandService } from '../../../../src/modules/arrivals/services/arrival-command.service';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

const mockManager = {} as any;

describe('ArrivalCommandService', () => {
  let service: ArrivalCommandService;
  let transactionService: { run: jest.Mock };
  let arrivalRepository: Record<string, jest.Mock>;
  let arrivalItemRepository: Record<string, jest.Mock>;
  let notificationRepository: Record<string, jest.Mock>;
  let orderRepository: Record<string, jest.Mock>;
  let orderItemRepository: Record<string, jest.Mock>;
  let merchantRepository: Record<string, jest.Mock>;

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
    arrivalRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getRepo: jest.fn().mockReturnValue({ findOne: jest.fn() }),
    };
    arrivalItemRepository = {
      create: jest.fn(),
    };
    notificationRepository = {
      create: jest.fn(),
    };
    orderRepository = {
      getRepo: jest.fn().mockReturnValue({ findOne: jest.fn() }),
      update: jest.fn(),
    };
    orderItemRepository = {
      update: jest.fn(),
    };
    merchantRepository = {
      findOneById: jest.fn(),
    };

    service = new ArrivalCommandService(
      transactionService as unknown as TransactionService,
      arrivalRepository as any,
      arrivalItemRepository as any,
      notificationRepository as any,
      orderRepository as any,
      orderItemRepository as any,
      merchantRepository as any,
    );
  });

  describe('create', () => {
    it('ควร throw NotFoundException เมื่อหา order ไม่เจอ', async () => {
      orderRepository.getRepo.mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.create(
          { orderId: 999, arrivalItems: [] },
          currentUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร throw NotFoundException เมื่อหา merchant ไม่เจอ', async () => {
      orderRepository.getRepo.mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          merchant: { id: 10 },
          orderItems: [],
          customerOrders: [],
        }),
      });
      merchantRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.create(
          { orderId: 1, arrivalItems: [] },
          currentUser,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร throw BadRequestException เมื่อ order ไม่ใช่ของ merchant นี้', async () => {
      orderRepository.getRepo.mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          merchant: { id: 99 },
          orderItems: [],
          customerOrders: [],
        }),
      });
      merchantRepository.findOneById.mockResolvedValue({ id: 10 });

      await expect(
        service.create(
          { orderId: 1, arrivalItems: [] },
          currentUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('ควร throw BadRequestException เมื่อ arrived quantity มากกว่า order quantity', async () => {
      orderRepository.getRepo.mockReturnValue({
        findOne: jest.fn().mockResolvedValue({
          id: 1,
          merchant: { id: 10 },
          orderItems: [
            { id: 100, quantity: 5, productName: 'Product A' },
          ],
          customerOrders: [],
        }),
      });
      merchantRepository.findOneById.mockResolvedValue({ id: 10 });

      await expect(
        service.create(
          {
            orderId: 1,
            arrivalItems: [
              { orderItemId: 100, arrivedQuantity: 10 },
            ],
          },
          currentUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา arrival ไม่เจอ', async () => {
      arrivalRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.update(1, { notes: 'updated' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร update สำเร็จ', async () => {
      arrivalRepository.findOneById.mockResolvedValue({ id: 1 });
      arrivalRepository.update.mockResolvedValue(null);

      await service.update(1, { notes: 'updated notes' });

      expect(arrivalRepository.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ notes: 'updated notes' }),
        mockManager,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา arrival ไม่เจอ', async () => {
      arrivalRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      arrivalRepository.findOneById.mockResolvedValue({ id: 1 });
      arrivalRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(arrivalRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });
});
