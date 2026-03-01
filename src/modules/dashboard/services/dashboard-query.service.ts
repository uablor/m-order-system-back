import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminDashboardDetailsResponseDto } from '../dto/admin-dashboard-details.dto';
import { AdminDashboardSummaryResponseDto } from '../dto/admin-dashboard-summary.dto';
import { MerchantSummaryResponseDto } from '../dto/merchant-summary.dto';
import { MerchantPriceSummaryResponseDto } from '../dto/merchant-price-summary.dto';
import { AnnualReportResponseDto, MonthlyReportDto } from '../dto/annual-report-response.dto';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

@Injectable()
export class DashboardQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async getAdminDashboardSummary(): Promise<AdminDashboardSummaryResponseDto> {
    const [
      merchantStats,
      adminUserStats,
      merchantUserStats,
      orderStats,
    ] = await Promise.all([
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM merchants`,
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM users WHERE merchant_id IS NULL`,
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM users WHERE merchant_id IS NOT NULL`,
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM orders`,
      ),
    ]);

    return {
      totalMerchants: Number(merchantStats[0]?.total ?? 0),
      totalAdminUsers: Number(adminUserStats[0]?.total ?? 0),
      totalMerchantUsers: Number(merchantUserStats[0]?.total ?? 0),
      totalOrders: Number(orderStats[0]?.total ?? 0),
    };
  }

  async getAdminDashboardDetails(): Promise<AdminDashboardDetailsResponseDto> {
    const [topMerchantRows, recentUserRows] = await Promise.all([
      this.dataSource.query<{
        id: string;
        shop_name: string;
        total_orders: string;
        total_revenue_lak: string;
        total_profit_lak: string;
      }[]>(
        `SELECT
          m.id,
          m.shop_name,
          COUNT(o.id) AS total_orders,
          COALESCE(SUM(o.total_selling_amount), 0) AS total_revenue_lak,
          COALESCE(SUM(o.total_profit), 0) AS total_profit_lak
        FROM merchants m
        LEFT JOIN orders o ON o.merchant_id = m.id
        WHERE m.is_active = 1
        GROUP BY m.id, m.shop_name
        HAVING total_orders > 0
        ORDER BY total_orders DESC, total_revenue_lak DESC
        LIMIT 5`
      ),
      this.dataSource.query<{
        id: string;
        full_name: string;
        email: string;
        last_login: Date;
        merchant_id: string;
        merchant_shop_name: string;
      }[]>(
        `SELECT
          u.id,
          u.full_name,
          u.email,
          u.last_login,
          m.id AS merchant_id,
          m.shop_name AS merchant_shop_name
        FROM users u
        LEFT JOIN merchants m ON m.id = u.merchant_id
        WHERE u.last_login IS NOT NULL
        ORDER BY u.last_login DESC
        LIMIT 5`
      ),
    ]);

    const topMerchants = topMerchantRows.map(row => ({
      id: Number(row.id),
      shopName: row.shop_name,
      totalOrders: Number(row.total_orders),
      totalRevenue: String(row.total_revenue_lak),
      totalProfit: String(row.total_profit_lak),
    }));

    const recentUserLogins = recentUserRows.map(row => ({
      id: Number(row.id),
      fullName: row.full_name,
      email: row.email,
      lastLogin: row.last_login,
      merchant: row.merchant_id ? {
        id: Number(row.merchant_id),
        shopName: row.merchant_shop_name,
      } : undefined,
    }));

    return {
      topMerchants,
      recentUserLogins,
    };
  }

  async getMerchantSummary(merchantId: number): Promise<MerchantSummaryResponseDto> {
    const [
      userStats,
      customerStats,
      orderStats,
      paidOrderStats,
      arrivalStats,
      orderItemStats,
    ] = await Promise.all([
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM users WHERE merchant_id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(DISTINCT c.id) AS total
         FROM customers c
         INNER JOIN customer_orders co ON co.customer_id = c.id
         INNER JOIN orders o ON o.id = co.order_id
         WHERE o.merchant_id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM orders WHERE merchant_id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM orders WHERE merchant_id = ? AND payment_status = 'PAID'`,
        [merchantId],
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM arrivals WHERE merchant_id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM order_items WHERE order_id IN (
          SELECT id FROM orders WHERE merchant_id = ?
        )`,
        [merchantId],
      ),
    ]);

    return {
      totalUsers: Number(userStats[0]?.total ?? 0),
      totalCustomers: Number(customerStats[0]?.total ?? 0),
      totalOrders: Number(orderStats[0]?.total ?? 0),
      totalPaidOrders: Number(paidOrderStats[0]?.total ?? 0),
      totalArrivals: Number(arrivalStats[0]?.total ?? 0),
      totalOrderItems: Number(orderItemStats[0]?.total ?? 0),
    };
  }

  async getMerchantPriceSummary(merchantId: number): Promise<MerchantPriceSummaryResponseDto> {
    const [
      totalOrderItemsPrice,
      unpaidOrderItemsPrice,
      paidOrderItemsPrice,
      paidOrderItemsFinalCost,
      totalPaymentsPrice,
      rejectedPaymentsPrice,
      pendingVerifiedPaymentsPrice,
      pendingRejectedPaymentsPrice,
      totalFinalCost,
      totalShippingPrice,
      totalPaidFinalCost,
      totalPaidShippingPrice,
    ] = await Promise.all([
      // Total price in order items
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(purchase_total), 0) AS total FROM order_items WHERE order_id IN (
          SELECT id FROM orders WHERE merchant_id = ?
        )`,
        [merchantId],
      ),
      // Total price of unpaid order items
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(oi.purchase_total), 0) AS total 
         FROM order_items oi
         INNER JOIN orders o ON o.id = oi.order_id
         WHERE o.merchant_id = ? AND o.payment_status = 'UNPAID'`,
        [merchantId],
      ),
      // Total price of paid order items
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(oi.purchase_total), 0) AS total 
         FROM order_items oi
         INNER JOIN orders o ON o.id = oi.order_id
         WHERE o.merchant_id = ? AND o.payment_status = 'PAID'`,
        [merchantId],
      ),
      // Total final cost of paid order items
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(oi.total_cost_before_discount), 0) AS total 
         FROM order_items oi
         INNER JOIN orders o ON o.id = oi.order_id
         WHERE o.merchant_id = ? AND o.payment_status = 'PAID'`,
        [merchantId],
      ),
      // Total price in payments (all statuses)
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE merchant_id = ?`,
        [merchantId],
      ),
      // Total price of rejected payments
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE merchant_id = ? AND status = 'REJECTED'`,
        [merchantId],
      ),
      // Total price of pending verified payments
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE merchant_id = ? AND status = 'PENDING_VERIFIED'`,
        [merchantId],
      ),
      // Total price of pending rejected payments
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(amount), 0) AS total FROM payments WHERE merchant_id = ? AND status = 'PENDING_REJECTED'`,
        [merchantId],
      ),
      // Total final cost
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(total_cost_before_discount), 0) AS total FROM order_items WHERE order_id IN (
          SELECT id FROM orders WHERE merchant_id = ?
        )`,
        [merchantId],
      ),
      // Total shipping price
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(shipping_price), 0) AS total FROM order_items WHERE order_id IN (
          SELECT id FROM orders WHERE merchant_id = ?
        )`,
        [merchantId],
      ),
      // Total final cost of paid items
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(oi.total_cost_before_discount), 0) AS total 
         FROM order_items oi
         INNER JOIN orders o ON o.id = oi.order_id
         WHERE o.merchant_id = ? AND o.payment_status = 'PAID'`,
        [merchantId],
      ),
      // Total shipping price of paid items
      this.dataSource.query<{ total: string }[]>(
        `SELECT COALESCE(SUM(oi.shipping_price), 0) AS total 
         FROM order_items oi
         INNER JOIN orders o ON o.id = oi.order_id
         WHERE o.merchant_id = ? AND o.payment_status = 'PAID'`,
        [merchantId],
      ),
    ]);

    return {
      totalOrderItemsPrice: Number(totalOrderItemsPrice[0]?.total ?? 0),
      totalUnpaidOrderItemsPrice: Number(unpaidOrderItemsPrice[0]?.total ?? 0),
      totalPaidOrderItemsPrice: Number(paidOrderItemsPrice[0]?.total ?? 0),
      totalPaidOrderItemsFinalCost: Number(paidOrderItemsFinalCost[0]?.total ?? 0),
      totalPaymentsPrice: Number(totalPaymentsPrice[0]?.total ?? 0),
      totalRejectedPaymentsPrice: Number(rejectedPaymentsPrice[0]?.total ?? 0),
      totalPendingVerifiedPaymentsPrice: Number(pendingVerifiedPaymentsPrice[0]?.total ?? 0),
      totalPendingRejectedPaymentsPrice: Number(pendingRejectedPaymentsPrice[0]?.total ?? 0),
      totalFinalCost: Number(totalFinalCost[0]?.total ?? 0),
      totalShippingPrice: Number(totalShippingPrice[0]?.total ?? 0),
      totalPaidFinalCost: Number(totalPaidFinalCost[0]?.total ?? 0),
      totalPaidShippingPrice: Number(totalPaidShippingPrice[0]?.total ?? 0),
    };
  }

  async getAdminAnnualReport(year: number): Promise<AnnualReportResponseDto> {
    const rows = await this.dataSource.query<{
      month: string;
      orderCount: string;
      finalCost: string;
      revenue: string;
      profit: string;
    }[]>(
      `SELECT
        MONTH(order_date) AS month,
        COUNT(*) AS orderCount,
        COALESCE(SUM(total_final_cost), 0) AS finalCost,
        COALESCE(SUM(total_selling_amount), 0) AS revenue,
        COALESCE(SUM(total_profit), 0) AS profit
      FROM orders
      WHERE YEAR(order_date) = ?
      GROUP BY MONTH(order_date)
      ORDER BY MONTH(order_date)`,
      [year],
    );

    return { year, months: this.buildMonthlyReport(rows) };
  }

  private toStatusMap(
    rows: { [key: string]: string }[],
    statusKey: string,
  ): Record<string, string> {
    const map: Record<string, string> = {};
    for (const row of rows) {
      map[row[statusKey]] = row['cnt'];
    }
    return map;
  }

  private buildMonthlyReport(
    rows: {
      month: string;
      orderCount: string;
      finalCost: string;
      revenue: string;
      profit: string;
    }[],
  ): MonthlyReportDto[] {
    const rowMap: Record<number, (typeof rows)[0]> = {};
    for (const row of rows) {
      rowMap[Number(row.month)] = row;
    }

    return Array.from({ length: 12 }, (_, i) => {
      const monthNum = i + 1;
      const row = rowMap[monthNum];
      return {
        month: monthNum,
        monthName: MONTH_NAMES[i],
        orderCount: Number(row?.orderCount ?? 0),
        finalCost: String(row?.finalCost ?? '0'),
        revenue: String(row?.revenue ?? '0'),
        profit: String(row?.profit ?? '0'),
      };
    });
  }
}
