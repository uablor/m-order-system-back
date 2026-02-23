import { NotFoundException } from '@nestjs/common';
import { OrderQueryService } from '../../../../src/modules/orders/services/order-query.service';

describe('OrderQueryService', () => {
  let service: OrderQueryService;
  let orderRepository: Record<string, jest.Mock>;
  let orderQueryRepository: {
    repository: { findOne: jest.Mock };
    findWithPagination: jest.Mock;
  };

  const mockOrder = {
    id: 1,
    merchant: { id: 10 },
    createdByUser: {
      id: 1,
      fullName: 'Admin',
      email: 'admin@test.com',
      roleId: 1,
      role: { roleName: 'ADMIN' },
      isActive: true,
      lastLogin: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    orderCode: 'ORD-001',
    orderDate: new Date('2025-06-15'),
    arrivalStatus: 'NOT_ARRIVED',
    arrivedAt: null,
    notifiedAt: null,
    totalPurchaseCostLak: '5000.00',
    totalShippingCostLak: '500.00',
    totalCostBeforeDiscountLak: '5000.00',
    totalDiscountLak: '0.00',
    totalFinalCostLak: '5000.00',
    totalFinalCostThb: '150.00',
    totalSellingAmountLak: '8000.00',
    totalSellingAmountThb: '240.00',
    totalProfitLak: '3000.00',
    totalProfitThb: '90.00',
    depositAmount: '0.00',
    paidAmount: '0.00',
    remainingAmount: '8000.00',
    paymentStatus: 'UNPAID',
    orderItems: [],
    customerOrders: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    orderRepository = {
      findOneById: jest.fn(),
    };
    orderQueryRepository = {
      repository: { findOne: jest.fn() },
      findWithPagination: jest.fn(),
    };

    service = new OrderQueryService(
      orderRepository as any,
      orderQueryRepository as any,
    );
  });

  describe('getById', () => {
    it('ควร return order response เมื่อเจอ', async () => {
      orderQueryRepository.repository.findOne.mockResolvedValue(mockOrder);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.id).toBe(1);
      expect(result!.orderCode).toBe('ORD-001');
    });

    it('ควร return null เมื่อหาไม่เจอ', async () => {
      orderQueryRepository.repository.findOne.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });

    it('ควร query without relations เมื่อ withRelations = false', async () => {
      orderRepository.findOneById.mockResolvedValue(null);

      await service.getById(1, false);

      expect(orderRepository.findOneById).toHaveBeenCalledWith(1);
    });
  });

  describe('getByIdOrFail', () => {
    it('ควร throw NotFoundException เมื่อหาไม่เจอ', async () => {
      orderQueryRepository.repository.findOne.mockResolvedValue(null);

      await expect(service.getByIdOrFail(999)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('ควร return wrapped response เมื่อเจอ', async () => {
      orderQueryRepository.repository.findOne.mockResolvedValue(mockOrder);

      const result = await service.getByIdOrFail(1);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
    });
  });

  describe('getById - orderItems/customerOrders safety', () => {
    it('ควร handle undefined orderItems gracefully', async () => {
      const orderWithoutItems = { ...mockOrder, orderItems: undefined, customerOrders: undefined };
      orderQueryRepository.repository.findOne.mockResolvedValue(orderWithoutItems);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.orderItems).toEqual([]);
      expect(result!.customerOrders).toEqual([]);
    });

    it('ควร handle null orderItems gracefully', async () => {
      const orderWithNull = { ...mockOrder, orderItems: null, customerOrders: null };
      orderQueryRepository.repository.findOne.mockResolvedValue(orderWithNull);

      const result = await service.getById(1);

      expect(result).toBeDefined();
      expect(result!.orderItems).toEqual([]);
      expect(result!.customerOrders).toEqual([]);
    });

    it('ควร map customerOrders with undefined customerOrderItems', async () => {
      const orderWithCo = {
        ...mockOrder,
        customerOrders: [{
          id: 1, orderId: 1, customerId: 1,
          totalSellingAmountLak: '1000', totalSellingAmountThb: '30',
          paymentStatus: 'UNPAID', paidAmount: '0', remainingAmount: '1000',
          customer: { id: 1, customerName: 'Test', customerType: 'CUSTOMER' },
          customerOrderItems: undefined,
          createdAt: new Date(), updatedAt: new Date(),
        }],
      };
      orderQueryRepository.repository.findOne.mockResolvedValue(orderWithCo);

      const result = await service.getById(1);

      expect(result!.customerOrders).toHaveLength(1);
      expect(result!.customerOrders[0].items).toEqual([]);
    });
  });

  describe('getList', () => {
    it('ควร return paginated response', async () => {
      orderQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockOrder],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getList({ page: 1, limit: 10 });

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(result.results[0].orderCode).toBe('ORD-001');
    });

    it('ควรส่ง merchantId เมื่อระบุ', async () => {
      orderQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({ page: 1, limit: 10, merchantId: 5 });

      expect(orderQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: 5 }),
      );
    });

    it('ควรส่ง search parameter เมื่อระบุ', async () => {
      orderQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      await service.getList({ page: 1, limit: 10, search: 'ORD-001' });

      expect(orderQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'ORD-001' }),
      );
    });
  });

  describe('getListByMerchant', () => {
    const mockCurrentUser = {
      userId: 1,
      email: 'admin@test.com',
      roleId: 1,
      roleName: 'ADMIN',
      merchantId: 10,
    } as any;

    it('ควร filter ด้วย merchantId จาก JWT token อัตโนมัติ', async () => {
      orderQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockOrder],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getListByMerchant({ page: 1, limit: 10 }, mockCurrentUser);

      expect(result.success).toBe(true);
      expect(result.results).toHaveLength(1);
      expect(orderQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: 10 }),
      );
    });

    it('ควร return paginated response ถูกต้อง', async () => {
      orderQueryRepository.findWithPagination.mockResolvedValue({
        results: [mockOrder],
        pagination: {
          total: 1, page: 1, limit: 10,
          totalPages: 1, hasNextPage: false, hasPreviousPage: false,
        },
      });

      const result = await service.getListByMerchant({ page: 1, limit: 10 }, mockCurrentUser);

      expect(result.results[0].orderCode).toBe('ORD-001');
      expect(result.results[0].merchantId).toBe(10);
    });

    it('ควรไม่รับ merchantId จาก query (ใช้จาก token เสมอ)', async () => {
      orderQueryRepository.findWithPagination.mockResolvedValue({
        results: [],
        pagination: {
          total: 0, page: 1, limit: 10,
          totalPages: 0, hasNextPage: false, hasPreviousPage: false,
        },
      });

      // ส่ง merchantId: 99 ใน query แต่ระบบควรใช้ merchantId: 10 จาก token
      await service.getListByMerchant({ page: 1, limit: 10, merchantId: 99 }, mockCurrentUser);

      expect(orderQueryRepository.findWithPagination).toHaveBeenCalledWith(
        expect.objectContaining({ merchantId: 10 }),
      );
    });
  });
});
