import { NotFoundException } from '@nestjs/common';
import { CustomerOrderQueryService } from '../../../../src/modules/orders/services/customer-order-query.service';
import { CustomerOrderQueryRepository } from '../../../../src/modules/orders/repositories/customer-order.query-repository';
import { CustomerOrderRepository } from '../../../../src/modules/orders/repositories/customer-order.repository';
import { DataSource } from 'typeorm';
import { CustomerOrderListQueryDto, TokenQueryDto } from '../../../../src/modules/orders/dto/customer-order-list-query.dto';

describe('CustomerOrderQueryService', () => {
  let service: CustomerOrderQueryService;
  let customerOrderRepository: jest.Mocked<CustomerOrderRepository>;
  let customerOrderQueryRepository: jest.Mocked<CustomerOrderQueryRepository>;
  let dataSource: jest.Mocked<DataSource>;

  const mockCustomerOrderEntity = {
    id: 1,
    totalSellingAmount: 1000,
    totalPaid: 500,
    remainingAmount: 500,
    paymentStatus: 'UNPAID',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: {
      id: 1,
      orderCode: 'ORD-001',
      exchangeRateSell: 650,
    },
    customer: {
      id: 1,
      customerName: 'John Doe',
      uniqueToken: 'token123',
    },
    customerOrderItems: [
      {
        id: 1,
        quantity: 2,
        sellingPriceForeign: 250,
        sellingTotal: 500,
        profit: 100,
        orderItemSku: {
          id: 1,
          variant: 'XL',
          exchangeRateBuy: 640,
          exchangeRateSell: 650,
          exchangeRateBuyValue: '640.000000',
          exchangeRateSellValue: '650.000000',
        },
      },
    ],
  } as any;

  beforeEach(() => {
    customerOrderRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getRepo: jest.fn(),
    } as any;

    customerOrderQueryRepository = {
      repository: {
        findOne: jest.fn(),
        find: jest.fn(),
        count: jest.fn(),
      },
      findWithPagination: jest.fn(),
    } as any;

    dataSource = {
      query: jest.fn(),
    } as any;

    service = new CustomerOrderQueryService(
      customerOrderRepository,
      customerOrderQueryRepository,
      dataSource,
    );

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('ควร return customer order response dto เมื่อพบข้อมูล', async () => {
      (customerOrderQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockCustomerOrderEntity);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.orderCode).toBe('ORD-001');
      expect(result?.customerName).toBe('John Doe');
      expect(result?.totalSellingAmount).toBe(1000);
      expect(result?.hasPendingPayment).toBe(true);
      expect(customerOrderQueryRepository.repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['order', 'customer', 'customerOrderItems', 'customerOrderItems.orderItem'],
      });
    });

    it('ควร return null เมื่อไม่พบข้อมูล', async () => {
      (customerOrderQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร return response เมื่อพบข้อมูล', async () => {
      (customerOrderQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockCustomerOrderEntity);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toBeDefined();
      expect(result.results?.id).toBe(1);
    });

    it('ควร throw NotFoundException เมื่อไม่พบข้อมูล', async () => {
      (customerOrderQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      const mockQuery: CustomerOrderListQueryDto = {
        page: 1,
        limit: 10,
        orderId: 1,
        customerOrderId: 1,
        customerId: 1,
        customerToken: 'token123',
        notificationToken: 'notif123',
        customerName: 'John',
        isArrived: true,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        paymentStatus: 'UNPAID',
      };

      const mockPaginationResult = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [mockCustomerOrderEntity],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      customerOrderQueryRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

      const result = await service.getList(mockQuery);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(customerOrderQueryRepository.findWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderId: 1,
        customerOrderId: 1,
        customerId: 1,
        customerToken: 'token123',
        notificationToken: 'notif123',
        customerName: 'John',
        isArrived: true,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        paymentStatus: 'UNPAID',
      });
    });
  });

  describe('getSummary', () => {
    it('ควร return summary data', async () => {
      const mockQuery: TokenQueryDto = {
        customerToken: 'token123',
        notificationToken: 'notif123',
      };

      const mockQueryResult = [
        {
          baseCurrency: 'THB',
          totalAll: 1000,
          totalUnpaid: 600,
          totalPaid: 400,
          rate: 650,
        },
        {
          baseCurrency: 'USD',
          totalAll: 500,
          totalUnpaid: 200,
          totalPaid: 300,
          rate: 670,
        },
      ];

      dataSource.query.mockResolvedValue(mockQueryResult);

      const result = await service.getSummary(mockQuery);

      expect(result).toBeDefined();
      expect(result).toHaveLength(3); // 2 currencies + LAK summary
      expect(result[0]).toEqual({
        baseCurrency: 'THB',
        totalAll: 1000,
        totalUnpaid: 600,
        totalPaid: 400,
      });
      expect(result[2]).toEqual({
        targetCurrency: 'LAK',
        totalAll: 1000 * 650 + 500 * 670,
        totalUnpaid: 600 * 650 + 200 * 670,
        totalPaid: 400 * 650 + 300 * 670,
      });
    });

    it('ควร handle empty result', async () => {
      const mockQuery: TokenQueryDto = {
        customerToken: 'token123',
        notificationToken: 'notif123',
      };

      dataSource.query.mockResolvedValue([]);

      const result = await service.getSummary(mockQuery);

      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        targetCurrency: 'LAK',
        totalAll: 0,
        totalUnpaid: 0,
        totalPaid: 0,
      });
    });
  });

  describe('toResponse (private method)', () => {
    it('ควร transform entity to response dto correctly', async () => {
      (customerOrderQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockCustomerOrderEntity);

      const result = await service.getById(1);

      expect(result).toEqual({
        id: 1,
        orderId: 1,
        orderCode: 'ORD-001',
        customerId: 1,
        customerName: 'John Doe',
        customerToken: 'token123',
        totalSellingAmount: 1000,
        totalPaid: 500,
        remainingAmount: 500,
        targetCurrencyTotalSellingAmount: expect.any(Number),
        targetCurrencyTotalPaid: expect.any(Number),
        targetCurrencyRemainingAmount: expect.any(Number),
        paymentStatus: 'UNPAID',
        hasPendingPayment: true,
        customerOrderItems: [
          {
            id: 1,
            orderItemSkuId: 1,
            variant: 'XL',
            quantity: 2,
            exchangeRateBuy: 640,
            exchangeRateSell: 650,
            exchangeRateBuyValue: '640.000000',
            exchangeRateSellValue: '650.000000',
            sellingPriceForeign: 250,
            sellingTotal: 500,
            profit: 100,
            targetCurrencySellingPriceForeign: expect.any(Number),
            targetCurrencySellingTotal: expect.any(Number),
          },
        ],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
