import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminDashboardResponseDto } from '../dto/admin-dashboard-response.dto';
import { MerchantDashboardResponseDto, LatestOrderDto } from '../dto/merchant-dashboard-response.dto';
import { AnnualReportResponseDto, MonthlyReportDto } from '../dto/annual-report-response.dto';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

@Injectable()
export class DashboardQueryService {
  constructor(private readonly dataSource: DataSource) {}

  async getAdminDashboard(): Promise<AdminDashboardResponseDto> {
    const [
      merchantStats,
      userCount,
      customerCount,
      orderStats,
      orderThisMonth,
      paymentStatusRows,
      arrivalStatusRows,
    ] = await Promise.all([
      this.dataSource.query<{ total: string; active: string }[]>(
        `SELECT COUNT(*) AS total, SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) AS active FROM merchants`,
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM users`,
      ),
      this.dataSource.query<{ total: string }[]>(
        `SELECT COUNT(*) AS total FROM customers`,
      ),
      this.dataSource.query<{
        orderCount: string;
        totalFinalCostLak: string;
        totalRevenueLak: string;
        totalRevenueThb: string;
        totalProfitLak: string;
        totalProfitThb: string;
        totalOutstandingAmountLak: string;
      }[]>(
        `SELECT
          COUNT(*) AS orderCount,
          COALESCE(SUM(total_final_cost_lak), 0) AS totalFinalCostLak,
          COALESCE(SUM(total_selling_amount_lak), 0) AS totalRevenueLak,
          COALESCE(SUM(total_selling_amount_thb), 0) AS totalRevenueThb,
          COALESCE(SUM(total_profit_lak), 0) AS totalProfitLak,
          COALESCE(SUM(total_profit_thb), 0) AS totalProfitThb,
          COALESCE(SUM(remaining_amount), 0) AS totalOutstandingAmountLak
        FROM orders`,
      ),
      this.dataSource.query<{ orderCount: string }[]>(
        `SELECT COUNT(*) AS orderCount FROM orders
         WHERE YEAR(order_date) = YEAR(CURDATE()) AND MONTH(order_date) = MONTH(CURDATE())`,
      ),
      this.dataSource.query<{ payment_status: string; cnt: string }[]>(
        `SELECT payment_status, COUNT(*) AS cnt FROM orders GROUP BY payment_status`,
      ),
      this.dataSource.query<{ arrival_status: string; cnt: string }[]>(
        `SELECT arrival_status, COUNT(*) AS cnt FROM orders GROUP BY arrival_status`,
      ),
    ]);

    const paymentMap = this.toStatusMap(paymentStatusRows, 'payment_status');
    const arrivalMap = this.toStatusMap(arrivalStatusRows, 'arrival_status');

    const stats = orderStats[0];

    return {
      totalMerchants: Number(merchantStats[0]?.total ?? 0),
      activeMerchants: Number(merchantStats[0]?.active ?? 0),
      totalUsers: Number(userCount[0]?.total ?? 0),
      totalCustomers: Number(customerCount[0]?.total ?? 0),
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
      totalFinalCostLak: String(stats?.totalFinalCostLak ?? '0'),
      totalRevenueLak: String(stats?.totalRevenueLak ?? '0'),
      totalRevenueThb: String(stats?.totalRevenueThb ?? '0'),
      totalProfitLak: String(stats?.totalProfitLak ?? '0'),
      totalProfitThb: String(stats?.totalProfitThb ?? '0'),
      totalOutstandingAmountLak: String(stats?.totalOutstandingAmountLak ?? '0'),
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
        totalFinalCostLak: string;
        totalRevenueLak: string;
        totalRevenueThb: string;
        totalProfitLak: string;
        totalProfitThb: string;
        totalOutstandingAmountLak: string;
      }[]>(
        `SELECT
          COUNT(*) AS orderCount,
          COALESCE(SUM(total_final_cost_lak), 0) AS totalFinalCostLak,
          COALESCE(SUM(total_selling_amount_lak), 0) AS totalRevenueLak,
          COALESCE(SUM(total_selling_amount_thb), 0) AS totalRevenueThb,
          COALESCE(SUM(total_profit_lak), 0) AS totalProfitLak,
          COALESCE(SUM(total_profit_thb), 0) AS totalProfitThb,
          COALESCE(SUM(remaining_amount), 0) AS totalOutstandingAmountLak
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
        total_selling_amount_lak: string;
        customer_name: string | null;
      }[]>(
        `SELECT
          o.id,
          o.order_code,
          o.arrival_status,
          o.total_selling_amount_lak,
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
      totalAmount: String(row.total_selling_amount_lak ?? '0'),
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
      totalFinalCostLak: String(stats?.totalFinalCostLak ?? '0'),
      totalRevenueLak: String(stats?.totalRevenueLak ?? '0'),
      totalRevenueThb: String(stats?.totalRevenueThb ?? '0'),
      totalProfitLak: String(stats?.totalProfitLak ?? '0'),
      totalProfitThb: String(stats?.totalProfitThb ?? '0'),
      totalOutstandingAmountLak: String(stats?.totalOutstandingAmountLak ?? '0'),
      latestOrders,
    };
  }

  async getAdminAnnualReport(year: number): Promise<AnnualReportResponseDto> {
    const rows = await this.dataSource.query<{
      month: string;
      orderCount: string;
      finalCostLak: string;
      revenueLak: string;
      revenueThb: string;
      profitLak: string;
      profitThb: string;
    }[]>(
      `SELECT
        MONTH(order_date) AS month,
        COUNT(*) AS orderCount,
        COALESCE(SUM(total_final_cost_lak), 0) AS finalCostLak,
        COALESCE(SUM(total_selling_amount_lak), 0) AS revenueLak,
        COALESCE(SUM(total_selling_amount_thb), 0) AS revenueThb,
        COALESCE(SUM(total_profit_lak), 0) AS profitLak,
        COALESCE(SUM(total_profit_thb), 0) AS profitThb
      FROM orders
      WHERE YEAR(order_date) = ?
      GROUP BY MONTH(order_date)
      ORDER BY MONTH(order_date)`,
      [year],
    );

    return { year, months: this.buildMonthlyReport(rows) };
  }

  async getMerchantAnnualReport(year: number, merchantId: number): Promise<AnnualReportResponseDto> {
    const rows = await this.dataSource.query<{
      month: string;
      orderCount: string;
      finalCostLak: string;
      revenueLak: string;
      revenueThb: string;
      profitLak: string;
      profitThb: string;
    }[]>(
      `SELECT
        MONTH(order_date) AS month,
        COUNT(*) AS orderCount,
        COALESCE(SUM(total_final_cost_lak), 0) AS finalCostLak,
        COALESCE(SUM(total_selling_amount_lak), 0) AS revenueLak,
        COALESCE(SUM(total_selling_amount_thb), 0) AS revenueThb,
        COALESCE(SUM(total_profit_lak), 0) AS profitLak,
        COALESCE(SUM(total_profit_thb), 0) AS profitThb
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
      finalCostLak: string;
      revenueLak: string;
      revenueThb: string;
      profitLak: string;
      profitThb: string;
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
        finalCostLak: String(row?.finalCostLak ?? '0'),
        revenueLak: String(row?.revenueLak ?? '0'),
        revenueThb: String(row?.revenueThb ?? '0'),
        profitLak: String(row?.profitLak ?? '0'),
        profitThb: String(row?.profitThb ?? '0'),
      };
    });
  }
}
