import { NotFoundException } from '@nestjs/common';
import { ArrivalQueryService } from '../../../../src/modules/arrivals/services/arrival-query.service';

describe('ArrivalQueryService', () => {
  let service: ArrivalQueryService;
  let arrivalRepository: Record<string, jest.Mock>;
  let arrivalQueryRepository: {
    repository: { findOne: jest.Mock };
    findWithPagination: jest.Mock;
  };

  const mockArrival = {
    id: 1,
    order: { id: 100 },
    merchant: { id: 10 },
    arrivedDate: new Date('2025-06-15'),
    arrivedTime: '14:30',
    recordedByUser: { id: 1 },
    notes: 'Arrived safely',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    arrivalRepository = {
      findOneById: jest.fn(),
    };
    arrivalQueryRepository = {
      repository: { findOne: jest.fn() },
      findWithPagination: jest.fn(),
    };

    service = new ArrivalQueryService(
      arrivalRepository as any,
      arrivalQueryRepository as any,
    );
  });

  describe('getById', () => {
    it('ควร return arrival เมื่อเจอ', async () => {
      arrivalQueryRepository.repository.findOne.mockResolvedValue(mockArrival);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
      expect(result!.arrivedTime).toBe('14:30');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      arrivalQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });

    it('ควร query without relations เมื่อ withRelations = false', async () => {
      arrivalRepository.findOneById.mockResolvedValue(null);

      await service.getById(1, false);

      expect(arrivalRepository.findOneById).toHaveBeenCalledWith(1);
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      arrivalQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร return wrapped response เมื่อเจอ', async () => {
      arrivalQueryRepository.repository.findOne.mockResolvedValue(mockArrival);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      arrivalQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockArrival],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });

    it('ควรส่ง filter ที่ถูกต้อง', async () => {
      arrivalQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({
        page: 1,
        limit: 10,
        merchantId: 10,
        orderId: 100,
      });

      expect(arrivalQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({
          merchantId: 10,
          orderId: 100,
        }),
      );
    });
  });

  describe('getByIdWithItems', () => {
    it('ควร return arrival with items เมื่อเจอ', async () => {
      arrivalQueryRepository.repository.findOne.mockResolvedValue(mockArrival);

      const result = await service.getByIdWithItems(1);

      expect(result).toBeDefined();
      expect(arrivalQueryRepository.repository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          relations: expect.arrayContaining(['arrivalItems']),
        }),
      );
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      arrivalQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getByIdWithItems(999);

      expect(result).toBeNull();
    });
  });
});
