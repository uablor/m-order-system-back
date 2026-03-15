import { NotFoundException } from '@nestjs/common';
import { ArrivalItemQueryService } from '../../../../src/modules/arrivals/services/arrival-item-query.service';
import { ArrivalItemRepository } from '../../../../src/modules/arrivals/repositories/arrival-item.repository';
import { ArrivalItemQueryRepository } from '../../../../src/modules/arrivals/repositories/arrival-item.query-repository';
import { ArrivalItemOrmEntity } from '../../../../src/modules/arrivals/entities/arrival-item.orm-entity';

describe('ArrivalItemQueryService', () => {
  let service: ArrivalItemQueryService;
  let arrivalItemRepository: {
    findOneById: jest.Mock;
  };
  let arrivalItemQueryRepository: {
    repository: {
      findOne: jest.Mock;
    };
    findWithPagination: jest.Mock;
  };

  const mockArrivalItem: ArrivalItemOrmEntity = {
    id: 1,
    arrival: { id: 10 } as any,
    orderItem: { id: 5, quantity: 10 } as any,
    arrivedQuantity: 8,
    condition: 'OK',
    notes: 'Test notes',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  } as ArrivalItemOrmEntity;

  beforeEach(() => {
    arrivalItemRepository = {
      findOneById: jest.fn(),
    };

    arrivalItemQueryRepository = {
      repository: {
        findOne: jest.fn(),
      },
      findWithPagination: jest.fn(),
    };

    service = new ArrivalItemQueryService(
      arrivalItemRepository as any,
      arrivalItemQueryRepository as any,
    );
  });

  describe('getById', () => {
    it('ควร return arrival item response เมื่อเจอ', async () => {
      arrivalItemQueryRepository.repository.findOne.mockResolvedValue(mockArrivalItem);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
      expect(result!.arrivalId).toBe(10);
      expect(result!.orderItemId).toBe(5);
      expect(result!.arrivedQuantity).toBe(8);
      expect(result!.condition).toBe('OK');
      expect(result!.notes).toBe('Test notes');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      arrivalItemQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });

    it('ควรจัดการกรณี arrival หรือ orderItem เป็น null', async () => {
      const itemWithoutRelations = {
        ...mockArrivalItem,
        arrival: null,
        orderItem: null,
      };
      arrivalItemQueryRepository.repository.findOne.mockResolvedValue(itemWithoutRelations);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.arrivalId).toBe(0);
      expect(result!.orderItemId).toBe(0);
    });

    it('ควรจัดการกรณี condition หรือ notes เป็น null', async () => {
      const itemWithNulls = {
        ...mockArrivalItem,
        condition: null,
        notes: null,
      };
      arrivalItemQueryRepository.repository.findOne.mockResolvedValue(itemWithNulls);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.condition).toBeNull();
      expect(result!.notes).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      arrivalItemQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(NotFoundException);
    });

    it('ควร return wrapped response เมื่อเจอ', async () => {
      arrivalItemQueryRepository.repository.findOne.mockResolvedValue(mockArrivalItem);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toBeDefined();
      expect(result.results).toHaveProperty('id', 1);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      arrivalItemQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockArrivalItem],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      const result = await service.getList({
        page: 1,
        limit: 10,
        arrivalId: 10,
        orderItemId: 5,
        createdByUserId: 1,
      });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.pagination).toBeDefined();
    });

    it('ควรเรียก findWithPagination ด้วย parameters ที่ถูกต้อง', async () => {
      arrivalItemQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      await service.getList({
        page: 2,
        limit: 5,
        arrivalId: 20,
        orderItemId: 15,
        createdByUserId: 3,
      });

      expect(arrivalItemQueryRepository.findWithPagination).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        arrivalId: 20,
        orderItemId: 15,
        createdByUserId: 3,
      });
    });

    it('ควร map entities ไปเป็น response DTOs อย่างถูกต้อง', async () => {
      const itemWithNulls = {
        ...mockArrivalItem,
        condition: null,
        notes: null,
        arrival: null,
        orderItem: null,
      };
      arrivalItemQueryRepository.findWithPagination.mockResolvedValue({
        results: [itemWithNulls],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      });

      const result = await service.getList({
        page: 1,
        limit: 10,
      });

      expect(result.results[0].condition).toBeNull();
      expect(result.results[0].notes).toBeNull();
      expect(result.results[0].arrivalId).toBe(0);
      expect(result.results[0].orderItemId).toBe(0);
    });
  });
});
