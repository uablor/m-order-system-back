import { NotFoundException } from '@nestjs/common';
import { ArrivalItemCommandService } from '../../../../src/modules/arrivals/services/arrival-item-command.service';
import { TransactionService } from '../../../../src/common/transaction/transaction.service';
import { ArrivalItemOrmEntity } from '../../../../src/modules/arrivals/entities/arrival-item.orm-entity';

const mockManager = {} as any;

describe('ArrivalItemCommandService', () => {
  let service: ArrivalItemCommandService;
  let transactionService: { run: jest.Mock };
  let arrivalItemRepository: {
    findOneById: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  const mockArrivalItem: ArrivalItemOrmEntity = {
    id: 1,
    arrivalId: 10,
    orderItemId: 5,
    arrivedQuantity: 10,
    condition: 'OK',
    notes: 'Test notes',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  } as ArrivalItemOrmEntity;

  beforeEach(() => {
    transactionService = {
      run: jest.fn((fn: (manager: any) => Promise<any>) => fn(mockManager)),
    };

    arrivalItemRepository = {
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    service = new ArrivalItemCommandService(
      transactionService as unknown as TransactionService,
      arrivalItemRepository as any,
    );
  });

  describe('update', () => {
    it('ควร throw NotFoundException เมื่อหา arrival item ไม่เจอ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(null);

      await expect(
        service.update(999, { arrivedQuantity: 5 }),
      ).rejects.toThrow(NotFoundException);
    });

    it('ควร update arrived quantity สำเร็จ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.update.mockResolvedValue(null);

      await service.update(1, { arrivedQuantity: 15 });

      expect(arrivalItemRepository.update).toHaveBeenCalledWith(
        1,
        { arrivedQuantity: 15 },
        mockManager,
      );
    });

    it('ควร update condition สำเร็จ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.update.mockResolvedValue(null);

      await service.update(1, { condition: 'DAMAGED' });

      expect(arrivalItemRepository.update).toHaveBeenCalledWith(
        1,
        { condition: 'DAMAGED' },
        mockManager,
      );
    });

    it('ควร update notes สำเร็จ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.update.mockResolvedValue(null);

      await service.update(1, { notes: 'Updated notes' });

      expect(arrivalItemRepository.update).toHaveBeenCalledWith(
        1,
        { notes: 'Updated notes' },
        mockManager,
      );
    });

    it('ควร update multiple fields สำเร็จ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.update.mockResolvedValue(null);

      await service.update(1, {
        arrivedQuantity: 20,
        condition: 'LOST',
        notes: 'Lost during shipping',
      });

      expect(arrivalItemRepository.update).toHaveBeenCalledWith(
        1,
        {
          arrivedQuantity: 20,
          condition: 'LOST',
          notes: 'Lost during shipping',
        },
        mockManager,
      );
    });

    it('ควรจัดการกรณี notes เป็น null', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.update.mockResolvedValue(null);

      await service.update(1, { notes: null });

      expect(arrivalItemRepository.update).toHaveBeenCalledWith(
        1,
        { notes: null },
        mockManager,
      );
    });

    it('ควรจัดการกรณี condition เป็น null', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.update.mockResolvedValue(null);

      await service.update(1, { condition: null });

      expect(arrivalItemRepository.update).toHaveBeenCalledWith(
        1,
        { condition: null },
        mockManager,
      );
    });
  });

  describe('delete', () => {
    it('ควร throw NotFoundException เมื่อหา arrival item ไม่เจอ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(null);

      await expect(service.delete(999)).rejects.toThrow(NotFoundException);
    });

    it('ควร delete สำเร็จ', async () => {
      arrivalItemRepository.findOneById.mockResolvedValue(mockArrivalItem);
      arrivalItemRepository.delete.mockResolvedValue(true);

      await service.delete(1);

      expect(arrivalItemRepository.delete).toHaveBeenCalledWith(1, mockManager);
    });
  });
});
