import { DashboardQueryService } from '../../../../src/modules/dashboard/services/dashboard-query.service';
import { DataSource } from 'typeorm';

describe('DashboardQueryService', () => {
  let service: DashboardQueryService;
  let dataSource: {
    query: jest.Mock;
  };

  beforeEach(() => {
    dataSource = {
      query: jest.fn(),
    };

    service = new DashboardQueryService(dataSource as any);
  });

  describe('getAdminDashboardSummary', () => {
    it('ควร return admin dashboard summary สำเร็จ', async () => {
      dataSource.query
        .mockResolvedValueOnce([{ total: '5' }])
        .mockResolvedValueOnce([{ total: '10' }])
        .mockResolvedValueOnce([{ total: '20' }])
        .mockResolvedValueOnce([{ total: '100' }]);

      const result = await service.getAdminDashboardSummary();

      expect(result).toEqual({
        totalMerchants: 5,
        totalAdminUsers: 10,
        totalMerchantUsers: 20,
        totalOrders: 100,
      });

      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM merchants'
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM users WHERE merchant_id IS NULL'
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM users WHERE merchant_id IS NOT NULL'
      );
      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM orders'
      );
    });

    it('ควรจัดการกรณี query return null หรือ empty', async () => {
      dataSource.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{}])
        .mockResolvedValueOnce([{ total: null }])
        .mockResolvedValueOnce([{ total: '0' }]);

      const result = await service.getAdminDashboardSummary();

      expect(result).toEqual({
        totalMerchants: 0,
        totalAdminUsers: 0,
        totalMerchantUsers: 0,
        totalOrders: 0,
      });
    });
  });

  describe('getAdminDashboardDetails', () => {
    it('ควร return admin dashboard details สำเร็จ', async () => {
      const mockTopMerchants = [
        {
          id: '1',
          shop_name: 'Shop A',
          total_orders: '50',
          owner_user: 'John Doe',
          owner_user_email: 'john@example.com',
        },
        {
          id: '2',
          shop_name: 'Shop B',
          total_orders: '30',
          owner_user: 'Jane Smith',
          owner_user_email: 'jane@example.com',
        },
      ];

      const mockRecentUsers = [
        {
          id: '1',
          full_name: 'Alice Johnson',
          email: 'alice@example.com',
          last_login: new Date('2025-01-01'),
          merchant_id: '1',
          merchant_shop_name: 'Shop A',
        },
        {
          id: '2',
          full_name: 'Bob Wilson',
          email: 'bob@example.com',
          last_login: new Date('2025-01-02'),
          merchant_id: null,
          merchant_shop_name: null,
        },
      ];

      dataSource.query
        .mockResolvedValueOnce(mockTopMerchants)
        .mockResolvedValueOnce(mockRecentUsers);

      const result = await service.getAdminDashboardDetails();

      expect(result.topMerchants).toHaveLength(2);
      expect(result.topMerchants[0]).toEqual({
        id: 1,
        shopName: 'Shop A',
        totalOrders: 50,
        ownerUser: 'John Doe',
        ownerUserEmail: 'john@example.com',
      });

      expect(result.recentUserLogins).toHaveLength(2);
      expect(result.recentUserLogins[0]).toEqual({
        id: 1,
        fullName: 'Alice Johnson',
        email: 'alice@example.com',
        lastLogin: new Date('2025-01-01'),
        merchant: {
          id: 1,
          shopName: 'Shop A',
        },
      });

      expect(result.recentUserLogins[1]).toEqual({
        id: 2,
        fullName: 'Bob Wilson',
        email: 'bob@example.com',
        lastLogin: new Date('2025-01-02'),
        merchant: undefined,
      });
    });

    it('ควรจัดการกรณีไม่มีข้อมูล', async () => {
      dataSource.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.getAdminDashboardDetails();

      expect(result.topMerchants).toHaveLength(0);
      expect(result.recentUserLogins).toHaveLength(0);
    });
  });

  describe('getMerchantSummary', () => {
    it('ควร return merchant summary สำเร็จ', async () => {
      dataSource.query
        .mockResolvedValueOnce([{ total: '5' }])
        .mockResolvedValueOnce([{ total: '100' }])
        .mockResolvedValueOnce([{ total: '200' }])
        .mockResolvedValueOnce([{ total: '150' }])
        .mockResolvedValueOnce([{ total: '180' }])
        .mockResolvedValueOnce([{ total: '500' }]);

      const result = await service.getMerchantSummary(1);

      expect(result).toEqual({
        totalUsers: 5,
        totalCustomers: 100,
        totalOrders: 200,
        totalPaidOrders: 150,
        totalArrivals: 180,
        totalOrderItems: 500,
      });

      expect(dataSource.query).toHaveBeenCalledWith(
        'SELECT COUNT(*) AS total FROM users WHERE merchant_id = ?',
        [1]
      );
    });

    it('ควรจัดการกรณี query return empty results', async () => {
      dataSource.query
        .mockResolvedValue([])
        .mockResolvedValue([])
        .mockResolvedValue([])
        .mockResolvedValue([])
        .mockResolvedValue([])
        .mockResolvedValue([]);

      const result = await service.getMerchantSummary(999);

      expect(result).toEqual({
        totalUsers: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalPaidOrders: 0,
        totalArrivals: 0,
        totalOrderItems: 0,
      });
    });
  });

  describe('getMerchantPriceCurrencySummary', () => {
    it('ควร return currency summary สำเร็จ', async () => {
      const mockRows = [
        {
          baseCurrency: 'THB',
          totalAll: '1000',
          totalUnpaid: '300',
          totalPaid: '700',
          rate: '650',
        },
        {
          baseCurrency: 'USD',
          totalAll: '500',
          totalUnpaid: '100',
          totalPaid: '400',
          rate: '16000',
        },
        {
          baseCurrency: 'LAK',
          totalAll: '2000',
          totalUnpaid: '500',
          totalPaid: '1500',
          rate: '1',
        },
      ];

      dataSource.query.mockResolvedValue(mockRows);

      const result = await service.getMerchantPriceCurrencySummary(1);

      expect(result).toHaveLength(4);
      expect(result[0]).toEqual({
        baseCurrency: 'THB',
        totalAll: 1000,
        totalUnpaid: 300,
        totalPaid: 700,
      });
      expect(result[1]).toEqual({
        baseCurrency: 'USD',
        totalAll: 500,
        totalUnpaid: 100,
        totalPaid: 400,
      });
      expect(result[2]).toEqual({
        baseCurrency: 'LAK',
        totalAll: 2000,
        totalUnpaid: 500,
        totalPaid: 1500,
      });
      expect(result[3]).toEqual({
        targetCurrency: 'LAK',
        totalAll: expect.any(Number),
        totalUnpaid: expect.any(Number),
        totalPaid: expect.any(Number),
      });
    });

    it('ควรคำนวณ LAK totals อย่างถูกต้อง', async () => {
      const mockRows = [
        {
          baseCurrency: 'THB',
          totalAll: '1000',
          totalUnpaid: '300',
          totalPaid: '700',
          rate: '650',
        },
      ];

      dataSource.query.mockResolvedValue(mockRows);

      const result = await service.getMerchantPriceCurrencySummary(1);

      const lakSummary = result.find(r => r.targetCurrency === 'LAK');
      expect(lakSummary).toBeDefined();
      expect(lakSummary.totalAll).toBe(650000); // 1000 * 650
      expect(lakSummary.totalUnpaid).toBe(195000); // 300 * 650
      expect(lakSummary.totalPaid).toBe(455000); // 700 * 650
    });
  });

  describe('getMerchantPriceCurrencySummaryByDate', () => {
    it('ควร return date-based currency summary สำเร็จ', async () => {
      const startDate = new Date('2025-01-01');
      const endDate = new Date('2025-03-31');

      const mockBuyRows = [
        {
          year: '2025',
          month: '1',
          baseCurrency: 'THB',
          totalAll: '1000',
          totalUnpaid: '300',
          totalPaid: '700',
          rate: '650',
        },
      ];

      const mockSellRows = [
        {
          year: '2025',
          month: '1',
          baseCurrency: 'THB',
          totalAll: '1200',
          totalUnpaid: '400',
          totalPaid: '800',
          rate: '670',
        },
      ];

      dataSource.query
        .mockResolvedValueOnce(mockBuyRows)
        .mockResolvedValueOnce(mockSellRows);

      const result = await service.getMerchantPriceCurrencySummaryByDate(
        1,
        startDate,
        endDate
      );

      expect(result.startDate).toBe(startDate);
      expect(result.endDate).toBe(endDate);
      expect(result.months).toHaveLength(3); // Jan, Feb, Mar
      expect(result.totalSummary).toBeDefined();
      expect(result.totalSummary.targetCurrency).toBe('LAK');
    });

    it('ควรใช้ default dates เมื่อไม่ระบุ', async () => {
      dataSource.query
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const result = await service.getMerchantPriceCurrencySummaryByDate(1);

      expect(result.startDate).toBeInstanceOf(Date);
      expect(result.endDate).toBeInstanceOf(Date);
      expect(dataSource.query).toHaveBeenCalledWith(
        expect.any(String),
        [1, expect.any(Date), expect.any(Date)]
      );
    });
  });

  describe('getTopCustomersByBuyOrder', () => {
    it('ควร return top customers สำเร็จ', async () => {
      const mockResults = [
        {
          customerId: 1,
          customerName: 'Alice Johnson',
          customerEmail: 'alice@example.com',
          totalBuyAmountLak: '1000000',
          orderCount: '10',
          averageOrderAmountLak: '100000',
        },
        {
          customerId: 2,
          customerName: 'Bob Wilson',
          customerEmail: 'bob@example.com',
          totalBuyAmountLak: '500000',
          orderCount: '5',
          averageOrderAmountLak: '100000',
        },
      ];

      dataSource.query.mockResolvedValue(mockResults);

      const result = await service.getTopCustomersByBuyOrder(1);

      expect(result.customers).toHaveLength(2);
      expect(result.customers[0]).toEqual({
        rank: 1,
        customerId: 1,
        customerName: 'Alice Johnson',
        customerEmail: 'alice@example.com',
        totalBuyAmountLak: 1000000,
        orderCount: 10,
        averageOrderAmountLak: 100000,
      });
      expect(result.customers[1]).toEqual({
        rank: 2,
        customerId: 2,
        customerName: 'Bob Wilson',
        customerEmail: 'bob@example.com',
        totalBuyAmountLak: 500000,
        orderCount: 5,
        averageOrderAmountLak: 100000,
      });
    });

    it('ควรจัดการกรณีไม่มีลูกค้า', async () => {
      dataSource.query.mockResolvedValue([]);

      const result = await service.getTopCustomersByBuyOrder(1);

      expect(result.customers).toHaveLength(0);
    });

    it('ควรเรียก query ด้วย merchantId ที่ถูกต้อง', async () => {
      dataSource.query.mockResolvedValue([]);

      await service.getTopCustomersByBuyOrder(123);

      expect(dataSource.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE o.merchant_id = ?'),
        [123]
      );
    });
  });
});
