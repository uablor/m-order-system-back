import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminDashboardDetailsResponseDto } from '../dto/admin-dashboard-details.dto';
import { AdminDashboardSummaryResponseDto } from '../dto/admin-dashboard-summary.dto';
import { MerchantDashboardResponseDto, LatestOrderDto } from '../dto/merchant-dashboard-response.dto';
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

  async getMerchantDashboard(merchantId: number): Promise<MerchantDashboardResponseDto> {
    const [
      merchantInfo,
      orderStats,
      orderThisMonth,
      paymentStatusRows,
      arrivalStatusRows,
      customerCount,
      arrivalCount,
      latestOrderRows,
    ] = await Promise.all([
      this.dataSource.query<{ id: number; shop_name: string }[]>(
        `SELECT id, shop_name FROM merchants WHERE id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{
        orderCount: string;
        totalFinalCost: string;
        totalRevenue: string;
        totalProfit: string;
        totalOutstandingAmount: string;
      }[]>(
        `SELECT
          COUNT(*) AS orderCount,
          COALESCE(SUM(total_final_cost), 0) AS totalFinalCost,
          COALESCE(SUM(total_selling_amount), 0) AS totalRevenue,
          COALESCE(SUM(total_profit), 0) AS totalProfit,
          0 AS totalOutstandingAmount
        FROM orders WHERE merchant_id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{ orderCount: string }[]>(
        `SELECT COUNT(*) AS orderCount FROM orders
         WHERE merchant_id = ?
           AND YEAR(order_date) = YEAR(CURDATE())
           AND MONTH(order_date) = MONTH(CURDATE())`,
        [merchantId],
      ),
      this.dataSource.query<{ payment_status: string; cnt: string }[]>(
        `SELECT payment_status, COUNT(*) AS cnt FROM orders WHERE merchant_id = ? GROUP BY payment_status`,
        [merchantId],
      ),
      this.dataSource.query<{ arrival_status: string; cnt: string }[]>(
        `SELECT arrival_status, COUNT(*) AS cnt FROM orders WHERE merchant_id = ? GROUP BY arrival_status`,
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
        `SELECT COUNT(*) AS total FROM arrivals WHERE merchant_id = ?`,
        [merchantId],
      ),
      this.dataSource.query<{
        id: string;
        order_code: string;
        arrival_status: string;
        total_selling_amount: string;
        customer_name: string | null;
      }[]>(
        `SELECT
          o.id,
          o.order_code,
          o.arrival_status,
          o.total_selling_amount,
          (
            SELECT c.customer_name
            FROM customer_orders co
            INNER JOIN customers c ON c.id = co.customer_id
            WHERE co.order_id = o.id
            LIMIT 1
          ) AS customer_name
        FROM orders o
        WHERE o.merchant_id = ?
        ORDER BY o.created_at DESC
        LIMIT 5`,
        [merchantId],
      ),
    ]);

    const paymentMap = this.toStatusMap(paymentStatusRows, 'payment_status');
    const arrivalMap = this.toStatusMap(arrivalStatusRows, 'arrival_status');
    const stats = orderStats[0];

    const latestOrders: LatestOrderDto[] = latestOrderRows.map((row) => ({
      id: Number(row.id),
      orderCode: row.order_code,
      arrivalStatus: row.arrival_status,
      totalAmount: String(row.total_selling_amount ?? '0'),
      customerName: row.customer_name ?? null,
    }));

    return {
      merchantId,
      shopName: merchantInfo[0]?.shop_name ?? '',
      totalOrders: Number(stats?.orderCount ?? 0),
      totalOrdersThisMonth: Number(orderThisMonth[0]?.orderCount ?? 0),
      ordersByPaymentStatus: {
        UNPAID: Number(paymentMap['UNPAID'] ?? 0),
        PARTIAL: Number(paymentMap['PARTIAL'] ?? 0),
        PAID: Number(paymentMap['PAID'] ?? 0),
      },
      ordersByArrivalStatus: {
        NOT_ARRIVED: Number(arrivalMap['NOT_ARRIVED'] ?? 0),
        ARRIVED: Number(arrivalMap['ARRIVED'] ?? 0),
      },
      totalCustomers: Number(customerCount[0]?.total ?? 0),
      totalArrivals: Number(arrivalCount[0]?.total ?? 0),
      totalFinalCost: String(stats?.totalFinalCost ?? '0'),
      totalRevenue: String(stats?.totalRevenue ?? '0'),
      totalProfit: String(stats?.totalProfit ?? '0'),
      totalOutstandingAmount: String(stats?.totalOutstandingAmount ?? '0'),
      latestOrders,
    };
  }

  async getMerchantAnnualReport(year: number, merchantId: number): Promise<AnnualReportResponseDto> {
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
      WHERE YEAR(order_date) = ? AND merchant_id = ?
      GROUP BY MONTH(order_date)
      ORDER BY MONTH(order_date)`,
      [year, merchantId],
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
