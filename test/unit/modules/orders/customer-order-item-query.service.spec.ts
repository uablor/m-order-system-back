import { NotFoundException } from '@nestjs/common';
import { CustomerOrderItemQueryService } from '../../../../src/modules/orders/services/customer-order-item-query.service';
import { CustomerOrderItemQueryRepository } from '../../../../src/modules/orders/repositories/customer-order-item.query-repository';
import { CustomerOrderItemRepository } from '../../../../src/modules/orders/repositories/customer-order-item.repository';
import { CustomerOrderItemListQueryDto } from '../../../../src/modules/orders/dto/customer-order-item-list-query.dto';

describe('CustomerOrderItemQueryService', () => {
  let service: CustomerOrderItemQueryService;
  let customerOrderItemRepository: jest.Mocked<CustomerOrderItemRepository>;
  let customerOrderItemQueryRepository: jest.Mocked<CustomerOrderItemQueryRepository>;

  const mockCustomerOrderItemEntity = {
    id: 1,
    quantity: 2,
    sellingPriceForeign: 250,
    sellingTotal: 500,
    profit: 100,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    customerOrder: {
      id: 1,
    },
    orderItemSku: {
      id: 1,
      variant: 'XL',
      exchangeRateBuy: 640,
      exchangeRateSell: 650,
      exchangeRateBuyValue: '640.000000',
      exchangeRateSellValue: '650.000000',
    },
  } as any;

  beforeEach(() => {
    customerOrderItemRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getRepo: jest.fn(),
    } as any;

    customerOrderItemQueryRepository = {
      repository: {
        findOne: jest.fn(),
        find: jest.fn(),
        count: jest.fn(),
      },
      findWithPagination: jest.fn(),
    } as any;

    service = new CustomerOrderItemQueryService(
      customerOrderItemRepository,
      customerOrderItemQueryRepository,
    );

    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('ควร return customer order item response dto เมื่อพบข้อมูล', async () => {
      (customerOrderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockCustomerOrderItemEntity);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.customerOrderId).toBe(1);
      expect(result?.orderItemSkuId).toBe(1);
      expect(result?.quantity).toBe(2);
      expect(result?.sellingPriceForeign).toBe('250');
      expect(result?.sellingTotal).toBe('500');
      expect(result?.profit).toBe('100');
      expect(customerOrderItemQueryRepository.repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['customerOrder', 'orderItemSku'],
      });
    });

    it('ควร return null เมื่อไม่พบข้อมูล', async () => {
      (customerOrderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร return response เมื่อพบข้อมูล', async () => {
      (customerOrderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockCustomerOrderItemEntity);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toBeDefined();
      expect(result.results?.id).toBe(1);
    });

    it('ควร throw NotFoundException เมื่อไม่พบข้อมูล', async () => {
      (customerOrderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      const mockQuery: CustomerOrderItemListQueryDto = {
        page: 1,
        limit: 10,
        customerOrderId: 1,
        orderItemSkuId: 1,
      };

      const mockPaginationResult = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [mockCustomerOrderItemEntity],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      customerOrderItemQueryRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

      const result = await service.getList(mockQuery);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(customerOrderItemQueryRepository.findWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        customerOrderId: 1,
        orderItemSkuId: 1,
      });
    });

    it('ควร handle empty list', async () => {
      const mockQuery: CustomerOrderItemListQueryDto = {
        page: 1,
        limit: 10,
      };

      const mockPaginationResult = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      customerOrderItemQueryRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

      const result = await service.getList(mockQuery);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
    });
  });

  describe('toResponse (private method)', () => {
    it('ควร transform entity to response dto correctly', async () => {
      (customerOrderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockCustomerOrderItemEntity);

      const result = await service.getById(1);

      expect(result).toEqual({
        id: 1,
        customerOrderId: 1,
        orderItemSkuId: 1,
        quantity: 2,
        sellingPriceForeign: '250',
        sellingTotal: '500',
        profit: '100',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('ควร handle null relations', async () => {
      const entityWithNullRelations = {
        ...mockCustomerOrderItemEntity,
        customerOrder: null,
        orderItemSku: null,
      };

      (customerOrderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(entityWithNullRelations);

      const result = await service.getById(1);

      expect(result?.customerOrderId).toBe(0);
      expect(result?.orderItemSkuId).toBe(0);
    });
  });
});
