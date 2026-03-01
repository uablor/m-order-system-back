import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AdminDashboardDetailsResponseDto } from '../dto/admin-dashboard-details.dto';
import { AdminDashboardSummaryResponseDto } from '../dto/admin-dashboard-summary.dto';
import { MerchantSummaryResponseDto } from '../dto/merchant-summary.dto';
import { AnnualReportResponseDto, MonthlyReportDto } from '../dto/annual-report-response.dto';
import { TopCustomersResponseDto, TopCustomerDto } from '../dto/top-customers.dto';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

@Injectable()
export class DashboardQueryService {
  constructor(private readonly dataSource: DataSource) { }

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
        owner_user: string;
        owner_user_email: string;
      }[]>(
        `SELECT
          m.id,
          m.shop_name,
          COUNT(o.id) AS total_orders,
          u.full_name AS owner_user,
          u.email AS owner_user_email
        FROM merchants m
        INNER JOIN users u ON u.id = m.owner_user_id
        LEFT JOIN orders o ON o.merchant_id = m.id
        WHERE m.is_active = 1
        GROUP BY m.id, m.shop_name, u.full_name, u.email
        HAVING total_orders > 0
        ORDER BY total_orders DESC, owner_user ASC
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
      ownerUser: row.owner_user,
      ownerUserEmail: row.owner_user_email,
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


async getMerchantPriceCurrencySummary(
  merchantId: number
): Promise<any[]> {

  const query = `
SELECT 
  erb.base_currency as baseCurrency,
  SUM(o.total_final_cost) as totalAll,
  SUM(CASE WHEN o.payment_status = ? THEN o.total_final_cost ELSE 0 END) as totalUnpaid,
  SUM(CASE WHEN o.payment_status = ? THEN o.total_final_cost ELSE 0 END) as totalPaid,
  erb.rate as rate
FROM orders o
LEFT JOIN exchange_rates erb ON erb.id = o.exchange_rate_buy_id
WHERE o.merchant_id = ?
GROUP BY erb.base_currency, erb.rate

UNION ALL

SELECT 
  ers.base_currency as baseCurrency,
  SUM(o.total_selling_amount) as totalAll,
  SUM(CASE WHEN o.payment_status = ? THEN o.total_selling_amount ELSE 0 END) as totalUnpaid,
  SUM(CASE WHEN o.payment_status = ? THEN o.total_selling_amount ELSE 0 END) as totalPaid,
  ers.rate as rate
FROM orders o
LEFT JOIN exchange_rates ers ON ers.id = o.exchange_rate_sell_id
WHERE o.merchant_id = ?
GROUP BY ers.base_currency, ers.rate
`;

  const rows = await this.dataSource.query(query, [
    'UNPAID','PAID',merchantId,
    'UNPAID','PAID',merchantId
  ]);

  let lakTotalAll = 0;
  let lakTotalUnpaid = 0;
  let lakTotalPaid = 0;

  const result = rows.map(r => {

    const totalAll = Number(r.totalAll ?? 0);
    const totalUnpaid = Number(r.totalUnpaid ?? 0);
    const totalPaid = Number(r.totalPaid ?? 0);
    const rate = Number(r.rate ?? 1);

    lakTotalAll += totalAll * rate;
    lakTotalUnpaid += totalUnpaid * rate;
    lakTotalPaid += totalPaid * rate;

    return {
      baseCurrency: r.baseCurrency,
      totalAll,
      totalUnpaid,
      totalPaid
    };
  });

  result.push({
    targetCurrency: "LAK",
    totalAll: lakTotalAll,
    totalUnpaid: lakTotalUnpaid,
    totalPaid: lakTotalPaid
  });

  return result;
}

async getMerchantPriceCurrencySummaryByDate(
  merchantId: number,
  startDate?: Date,
  endDate?: Date
): Promise<any> {

  if (!startDate) {
    startDate = new Date(new Date().getFullYear(), 0, 1);
  }
  
  if (!endDate) {
    endDate = new Date(new Date().getFullYear(), 11, 31);
  }

  // Query 1: Buy rate (final cost)
  const buyQuery = `
    SELECT 
      YEAR(o.created_at) as year,
      MONTH(o.created_at) as month,
      erb.base_currency as baseCurrency,
      SUM(o.total_final_cost) as totalAll,
      SUM(CASE WHEN o.payment_status = 'UNPAID' THEN o.total_final_cost ELSE 0 END) as totalUnpaid,
      SUM(CASE WHEN o.payment_status = 'PAID' THEN o.total_final_cost ELSE 0 END) as totalPaid,
      erb.rate as rate
    FROM orders o
    LEFT JOIN exchange_rates erb ON erb.id = o.exchange_rate_buy_id
    WHERE o.merchant_id = ?
      AND o.created_at >= ?
      AND o.created_at <= ?
    GROUP BY YEAR(o.created_at), MONTH(o.created_at), erb.base_currency, erb.rate
  `;

  // Query 2: Sell rate (selling amount)
  const sellQuery = `
    SELECT 
      YEAR(o.created_at) as year,
      MONTH(o.created_at) as month,
      ers.base_currency as baseCurrency,
      SUM(o.total_selling_amount) as totalAll,
      SUM(CASE WHEN o.payment_status = 'UNPAID' THEN o.total_selling_amount ELSE 0 END) as totalUnpaid,
      SUM(CASE WHEN o.payment_status = 'PAID' THEN o.total_selling_amount ELSE 0 END) as totalPaid,
      ers.rate as rate
    FROM orders o
    LEFT JOIN exchange_rates ers ON ers.id = o.exchange_rate_sell_id
    WHERE o.merchant_id = ?
      AND o.created_at >= ?
      AND o.created_at <= ?
    GROUP BY YEAR(o.created_at), MONTH(o.created_at), ers.base_currency, ers.rate
  `;

  const [buyRows, sellRows] = await Promise.all([
    this.dataSource.query(buyQuery, [merchantId, startDate, endDate]),
    this.dataSource.query(sellQuery, [merchantId, startDate, endDate]),
  ]);

  // Generate all year-month keys between startDate and endDate
  const monthMap: Record<string, {
    year: number,
    month: number,
    buyRows: any[],
    sellRows: any[],
  }> = {};

  const cursor = new Date(startDate);
  cursor.setDate(1);

  while (
    cursor.getFullYear() < endDate.getFullYear() ||
    (cursor.getFullYear() === endDate.getFullYear() && cursor.getMonth() <= endDate.getMonth())
  ) {
    const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
    monthMap[key] = {
      year: cursor.getFullYear(),
      month: cursor.getMonth() + 1,
      buyRows: [],
      sellRows: [],
    };
    cursor.setMonth(cursor.getMonth() + 1);
  }

  // Fill rows into map
  for (const r of buyRows) {
    const key = `${Number(r.year)}-${Number(r.month)}`;
    if (monthMap[key]) monthMap[key].buyRows.push(r);
  }
  for (const r of sellRows) {
    const key = `${Number(r.year)}-${Number(r.month)}`;
    if (monthMap[key]) monthMap[key].sellRows.push(r);
  }

  // Yearly accumulator (LAK)
  let totalLakAll = 0;
  let totalLakUnpaid = 0;
  let totalLakPaid = 0;

  const months = Object.values(monthMap).map(({ year, month, buyRows, sellRows }) => {
    let lakTotalAll = 0;
    let lakTotalUnpaid = 0;
    let lakTotalPaid = 0;

    const currencies: any[] = [];

    // Buy side
    for (const r of buyRows) {
      const totalAll = Number(r.totalAll ?? 0);
      const totalUnpaid = Number(r.totalUnpaid ?? 0);
      const totalPaid = Number(r.totalPaid ?? 0);
      const rate = Number(r.rate ?? 1);

      lakTotalAll += totalAll * rate;
      lakTotalUnpaid += totalUnpaid * rate;
      lakTotalPaid += totalPaid * rate;

      currencies.push({
        type: 'BUY',
        baseCurrency: r.baseCurrency,
        totalAll,
        totalUnpaid,
        totalPaid,
      });
    }

    // Sell side
    for (const r of sellRows) {
      const totalAll = Number(r.totalAll ?? 0);
      const totalUnpaid = Number(r.totalUnpaid ?? 0);
      const totalPaid = Number(r.totalPaid ?? 0);
      const rate = Number(r.rate ?? 1);

      lakTotalAll += totalAll * rate;
      lakTotalUnpaid += totalUnpaid * rate;
      lakTotalPaid += totalPaid * rate;

      currencies.push({
        type: 'SELL',
        baseCurrency: r.baseCurrency,
        totalAll,
        totalUnpaid,
        totalPaid,
      });
    }

    totalLakAll += lakTotalAll;
    totalLakUnpaid += lakTotalUnpaid;
    totalLakPaid += lakTotalPaid;

    return {
      year,
      month,
      currencies,
      summary: {
        targetCurrency: 'LAK',
        totalAll: lakTotalAll,
        totalUnpaid: lakTotalUnpaid,
        totalPaid: lakTotalPaid,
      },
    };
  });

  return {
    startDate,
    endDate,
    months,
    totalSummary: {
      targetCurrency: 'LAK',
      totalAll: totalLakAll,
      totalUnpaid: totalLakUnpaid,
      totalPaid: totalLakPaid,
    },
  };
}

async getTopCustomersByBuyOrder(merchantId: number): Promise<TopCustomersResponseDto> {
  const query = `
    SELECT 
      u.id as customerId,
      u.full_name as customerName,
      u.email as customerEmail,
      COALESCE(SUM(o.total_final_cost * erb.rate), 0) as totalBuyAmountLak,
      COUNT(o.id) as orderCount,
      COALESCE(AVG(o.total_final_cost * erb.rate), 0) as averageOrderAmountLak
    FROM users u
    INNER JOIN customer_orders co ON co.customer_id = u.id
    INNER JOIN orders o ON o.id = co.order_id
    LEFT JOIN exchange_rates erb ON erb.id = o.exchange_rate_buy_id
    WHERE o.merchant_id = ?
      AND o.payment_status = 'PAID'
    GROUP BY u.id, u.full_name, u.email
    HAVING totalBuyAmountLak > 0
    ORDER BY totalBuyAmountLak DESC
    LIMIT 5
  `;

  const results = await this.dataSource.query<{
    customerId: number;
    customerName: string;
    customerEmail: string;
    totalBuyAmountLak: string;
    orderCount: string;
    averageOrderAmountLak: string;
  }[]>(query, [merchantId]);

  const customers: TopCustomerDto[] = results.map((result, index) => ({
    rank: index + 1,
    customerId: result.customerId,
    customerName: result.customerName,
    customerEmail: result.customerEmail,
    totalBuyAmountLak: Number(result.totalBuyAmountLak),
    orderCount: Number(result.orderCount),
    averageOrderAmountLak: Number(result.averageOrderAmountLak),
  }));

  return { customers };
}

}
