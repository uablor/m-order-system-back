import { NotFoundException } from '@nestjs/common';
import { OrderItemQueryService } from '../../../../src/modules/orders/services/order-item-query.service';
import { OrderItemQueryRepository } from '../../../../src/modules/orders/repositories/order-item.query-repository';
import { OrderItemRepository } from '../../../../src/modules/orders/repositories/order-item.repository';
import { OrderItemListQueryDto } from '../../../../src/modules/orders/dto/order-item-list-query.dto';
import type { CurrentUserPayload } from '../../../../src/common/decorators/current-user.decorator';

describe('OrderItemQueryService', () => {
  let service: OrderItemQueryService;
  let orderItemRepository: jest.Mocked<OrderItemRepository>;
  let orderItemQueryRepository: jest.Mocked<OrderItemQueryRepository>;

  const mockExchangeRateEntity = {
    id: 1,
    baseCurrency: 'THB',
    targetCurrency: 'LAK',
    rate: 650,
    rateType: 'BUY',
    rateDate: new Date('2024-01-01'),
    isActive: true,
  };

  const mockImageEntity = {
    id: 1,
    publicUrl: 'http://example.com/image.jpg',
    fileName: 'image.jpg',
    originalName: 'original.jpg',
  };

  const mockOrderItemEntity = {
    id: 1,
    productName: 'Test Product',
    quantity: 2,
    purchaseTotal: 1000,
    shippingTotal: 100,
    totalCostBeforeDiscount: 1100,
    discountType: 'PERCENTAGE',
    discountValue: 10,
    discountAmount: 110,
    finalCost: 990,
    sellingTotal: 1500,
    profit: 510,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    order: {
      id: 1,
      exchangeRateBuy: mockExchangeRateEntity,
      exchangeRateSell: { ...mockExchangeRateEntity, rateType: 'SELL', rate: 670 },
      exchangeRateBuyValue: '640.000000',
      exchangeRateSellValue: '670.000000',
    },
    image: mockImageEntity,
    skus: [
      {
        id: 1,
        variant: 'XL',
        quantity: 2,
        purchasePrice: 500,
        purchaseTotal: 1000,
        sellingPriceForeign: 750,
        sellingTotal: 1500,
        profit: 500,
        exchangeRateBuy: mockExchangeRateEntity,
        exchangeRateSell: { ...mockExchangeRateEntity, rateType: 'SELL', rate: 670 },
        exchangeRateBuyValue: '640.000000',
        exchangeRateSellValue: '670.000000',
        orderItemSkuIndex: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
  } as any;

  const mockCurrentUser: CurrentUserPayload = {
    userId: 1,
    email: 'test@example.com',
    roleId: 2,
    roleName: 'MERCHANT',
    merchantId: 10,
  };

  beforeEach(() => {
    orderItemRepository = {
      create: jest.fn(),
      findOneById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      getRepo: jest.fn(),
    } as any;

    orderItemQueryRepository = {
      repository: {
        findOne: jest.fn(),
        find: jest.fn(),
        count: jest.fn(),
      },
      findWithPagination: jest.fn(),
    } as any;

    service = new OrderItemQueryService(
      orderItemRepository,
      orderItemQueryRepository,
    );

    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('ควร return order item response dto เมื่อพบข้อมูล', async () => {
      (orderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockOrderItemEntity);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.orderId).toBe(1);
      expect(result?.productName).toBe('Test Product');
      expect(result?.quantity).toBe(2);
      expect(result?.orderItemIndex).toBe(1);
      expect(result?.image).toEqual({
        id: 1,
        publicUrl: 'http://example.com/image.jpg',
        fileName: 'image.jpg',
        originalName: 'original.jpg',
      });
      expect(orderItemQueryRepository.repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['order', 'exchangeRateBuy', 'exchangeRateSell', 'image'],
      });
    });

    it('ควร return null เมื่อไม่พบข้อมูล', async () => {
      (orderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร return response เมื่อพบข้อมูล', async () => {
      (orderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockOrderItemEntity);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toBeDefined();
      expect(result.results?.id).toBe(1);
    });

    it('ควร throw NotFoundException เมื่อไม่พบข้อมูล', async () => {
      (orderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      const mockQuery: OrderItemListQueryDto = {
        page: 1,
        limit: 10,
        orderId: 1,
      };

      const mockPaginationResult = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [mockOrderItemEntity],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      orderItemQueryRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

      const result = await service.getList(mockQuery);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(1);
      expect(orderItemQueryRepository.findWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderId: 1,
      });
    });
  });

  describe('getListByMerchant', () => {
    it('ควร return paginated response สำหรับ merchant', async () => {
      const mockQuery: OrderItemListQueryDto = {
        page: 1,
        limit: 10,
        orderId: 1,
      };

      const mockPaginationResult = {
        success: true,
        Code: 200,
        message: 'Success',
        results: [mockOrderItemEntity],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        },
      };

      orderItemQueryRepository.findWithPagination.mockResolvedValue(mockPaginationResult);

      const result = await service.getListByMerchant(mockQuery, mockCurrentUser);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(orderItemQueryRepository.findWithPagination).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        orderId: 1,
        merchantId: 10,
      });
    });

    it('ควร return empty response เมื่อไม่มี merchantId', async () => {
      const mockQuery: OrderItemListQueryDto = {
        page: 1,
        limit: 10,
      };

      const userWithoutMerchant: CurrentUserPayload = {
        ...mockCurrentUser,
        merchantId: undefined,
      };

      const result = await service.getListByMerchant(mockQuery, userWithoutMerchant);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(orderItemQueryRepository.findWithPagination).not.toHaveBeenCalled();
    });
  });

  describe('convertToTargetCurrency (private method)', () => {
    it('ควร return original amount เมื่อไม่มี exchange rate', () => {
      const result = (service as any).convertToTargetCurrency(1000, null);
      expect(result).toBe('1000');
    });

    it('ควร return original amount เมื่อ base currency = target currency', () => {
      const sameCurrencyRate = {
        ...mockExchangeRateEntity,
        baseCurrency: 'USD',
        targetCurrency: 'USD',
      };

      const result = (service as any).convertToTargetCurrency(1000, sameCurrencyRate);
      expect(result).toBe('1000');
    });

    it('ควร convert ด้วย BUY rate (amount / rate)', () => {
      const result = (service as any).convertToTargetCurrency(1000, mockExchangeRateEntity);
      expect(result).toBe((1000 / 650).toString());
    });

    it('ควร convert ด้วย SELL rate (amount * rate)', () => {
      const sellRate = { ...mockExchangeRateEntity, rateType: 'SELL', rate: 670 };

      const result = (service as any).convertToTargetCurrency(1000, sellRate);
      expect(result).toBe((1000 * 670).toString());
    });
  });

  describe('toResponse (private method)', () => {
    it('ควร transform entity to response dto correctly', async () => {
      (orderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(mockOrderItemEntity);

      const result = await service.getById(1);

      expect(result).toEqual({
        id: 1,
        orderId: 1,
        productName: 'Test Product',
        orderItemIndex: 1,
        quantity: 2,
        imageId: 1,
        image: {
          id: 1,
          publicUrl: 'http://example.com/image.jpg',
          fileName: 'image.jpg',
          originalName: 'original.jpg',
        },
        exchangeRateBuy: {
          id: 1,
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rate: '650',
          rateType: 'BUY',
          rateDate: expect.any(Date),
          isActive: true,
        },
        exchangeRateSell: {
          id: 1,
          baseCurrency: 'THB',
          targetCurrency: 'LAK',
          rate: '670',
          rateType: 'SELL',
          rateDate: expect.any(Date),
          isActive: true,
        },
        exchangeRateBuyValue: '640.000000',
        exchangeRateSellValue: '670.000000',
        purchaseTotal: '1000',
        shippingTotal: '100',
        totalCostBeforeDiscount: '1100',
        discountType: 'PERCENTAGE',
        discountValue: '10',
        discountAmount: '110',
        finalCost: '990',
        sellingTotal: '1500',
        profit: '510',
        skus: [
          {
            id: 1,
            orderItemId: 1,
            variant: 'XL',
            quantity: 2,
            exchangeRateBuy: {
              id: 1,
              baseCurrency: 'THB',
              targetCurrency: 'LAK',
              rate: '650',
              rateType: 'BUY',
              rateDate: expect.any(Date),
              isActive: true,
            },
            exchangeRateSell: {
              id: 1,
              baseCurrency: 'THB',
              targetCurrency: 'LAK',
              rate: '670',
              rateType: 'SELL',
              rateDate: expect.any(Date),
              isActive: true,
            },
            exchangeRateBuyValue: '640.000000',
            exchangeRateSellValue: '670.000000',
            purchasePrice: '500',
            purchaseTotal: '1000',
            sellingPriceForeign: '750',
            sellingTotal: '1500',
            profit: '500',
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
          },
        ],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('ควร handle null relations', async () => {
      const entityWithNullRelations = {
        ...mockOrderItemEntity,
        order: null,
        image: null,
        skus: [],
      };

      (orderItemQueryRepository.repository.findOne as jest.Mock).mockResolvedValue(entityWithNullRelations);

      const result = await service.getById(1);

      expect(result?.orderId).toBe(0);
      expect(result?.image).toBeNull();
      expect(result?.exchangeRateBuy).toBeNull();
      expect(result?.exchangeRateSell).toBeNull();
      expect(result?.skus).toHaveLength(0);
    });
  });
});
