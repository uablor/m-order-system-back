"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardQueryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
];
let DashboardQueryService = class DashboardQueryService {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async getAdminDashboardSummary() {
        const [merchantStats, adminUserStats, merchantUserStats, orderStats,] = await Promise.all([
            this.dataSource.query(`SELECT COUNT(*) AS total FROM merchants`),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM users WHERE merchant_id IS NULL`),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM users WHERE merchant_id IS NOT NULL`),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM orders`),
        ]);
        return {
            totalMerchants: Number(merchantStats[0]?.total ?? 0),
            totalAdminUsers: Number(adminUserStats[0]?.total ?? 0),
            totalMerchantUsers: Number(merchantUserStats[0]?.total ?? 0),
            totalOrders: Number(orderStats[0]?.total ?? 0),
        };
    }
    async getAdminDashboardDetails() {
        const [topMerchantRows, recentUserRows] = await Promise.all([
            this.dataSource.query(`SELECT
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
        LIMIT 5`),
            this.dataSource.query(`SELECT
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
        LIMIT 5`),
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
    async getMerchantSummary(merchantId) {
        const [userStats, customerStats, orderStats, paidOrderStats, arrivalStats, orderItemStats,] = await Promise.all([
            this.dataSource.query(`SELECT COUNT(*) AS total FROM users WHERE merchant_id = ?`, [merchantId]),
            this.dataSource.query(`SELECT COUNT(DISTINCT c.id) AS total
         FROM customers c
         INNER JOIN customer_orders co ON co.customer_id = c.id
         INNER JOIN orders o ON o.id = co.order_id
         WHERE o.merchant_id = ?`, [merchantId]),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM orders WHERE merchant_id = ?`, [merchantId]),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM orders WHERE merchant_id = ? AND payment_status = 'PAID'`, [merchantId]),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM arrivals WHERE merchant_id = ?`, [merchantId]),
            this.dataSource.query(`SELECT COUNT(*) AS total FROM order_items WHERE order_id IN (
          SELECT id FROM orders WHERE merchant_id = ?
        )`, [merchantId]),
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
    async getMerchantPriceCurrencySummary(merchantId) {
        const query = `
    SELECT
      erb.base_currency AS baseCurrency,
      SUM(o.total_final_cost) AS totalAll,
      SUM(CASE WHEN co.payment_status = 'UNPAID' THEN o.total_final_cost ELSE 0 END) AS totalUnpaid,
      SUM(CASE WHEN co.payment_status = 'PAID' THEN o.total_final_cost ELSE 0 END) AS totalPaid,
      erb.rate AS rate
    FROM
      orders o
      LEFT JOIN customer_orders co ON co.order_id = o.id
      LEFT JOIN exchange_rates erb ON erb.id = o.exchange_rate_buy_id
    WHERE
      o.merchant_id = ?
    GROUP BY
      erb.base_currency,
      erb.rate

    UNION ALL

    SELECT
      ers.base_currency AS baseCurrency,
      SUM(o.total_selling_amount) AS totalAll,
      SUM(CASE WHEN co.payment_status = 'UNPAID' THEN o.total_selling_amount ELSE 0 END) AS totalUnpaid,
      SUM(CASE WHEN co.payment_status = 'PAID' THEN o.total_selling_amount ELSE 0 END) AS totalPaid,
      ers.rate AS rate
    FROM
      orders o
      LEFT JOIN customer_orders co ON co.order_id = o.id
      LEFT JOIN exchange_rates ers ON ers.id = o.exchange_rate_sell_id
    WHERE
      o.merchant_id = ?
    GROUP BY
      ers.base_currency,
      ers.rate
  `;
        const rows = await this.dataSource.query(query, [merchantId, merchantId]);
        const currencyMap = new Map();
        let lakTotalAll = 0;
        let lakTotalUnpaid = 0;
        let lakTotalPaid = 0;
        for (const row of rows) {
            const { baseCurrency, totalAll, totalUnpaid, totalPaid, rate } = row;
            const key = `${baseCurrency}`;
            if (!currencyMap.has(key)) {
                currencyMap.set(key, {
                    baseCurrency,
                    totalAll: 0,
                    totalUnpaid: 0,
                    totalPaid: 0,
                });
            }
            const existing = currencyMap.get(key);
            existing.totalAll += Number(totalAll);
            existing.totalUnpaid += Number(totalUnpaid);
            existing.totalPaid += Number(totalPaid);
            if (baseCurrency === "LAK") {
                lakTotalAll += Number(totalAll);
                lakTotalUnpaid += Number(totalUnpaid);
                lakTotalPaid += Number(totalPaid);
            }
            else {
                lakTotalAll += Number(totalAll) * Number(rate);
                lakTotalUnpaid += Number(totalUnpaid) * Number(rate);
                lakTotalPaid += Number(totalPaid) * Number(rate);
            }
        }
        const result = Array.from(currencyMap.values());
        result.push({
            targetCurrency: "LAK",
            totalAll: lakTotalAll,
            totalUnpaid: lakTotalUnpaid,
            totalPaid: lakTotalPaid,
        });
        return result;
    }
    async getMerchantPriceCurrencySummaryByDate(merchantId, startDate, endDate) {
        if (!startDate) {
            startDate = new Date(new Date().getFullYear(), 0, 1);
        }
        if (!endDate) {
            endDate = new Date(new Date().getFullYear(), 11, 31);
        }
        const buyQuery = `
    SELECT 
      YEAR(o.created_at) as year,
      MONTH(o.created_at) as month,
      erb.base_currency as baseCurrency,
      SUM(o.total_final_cost) as totalAll,
      SUM(CASE WHEN co.payment_status = 'UNPAID' THEN o.total_final_cost ELSE 0 END) as totalUnpaid,
      SUM(CASE WHEN co.payment_status = 'PAID' THEN o.total_final_cost ELSE 0 END) as totalPaid,
      erb.rate as rate
    FROM orders o
    LEFT JOIN customer_orders co ON co.order_id = o.id
    LEFT JOIN exchange_rates erb ON erb.id = o.exchange_rate_buy_id
    WHERE o.merchant_id = ?
      AND o.created_at >= ?
      AND o.created_at <= ?
    GROUP BY YEAR(o.created_at), MONTH(o.created_at), erb.base_currency, erb.rate
  `;
        const sellQuery = `
    SELECT 
      YEAR(o.created_at) as year,
      MONTH(o.created_at) as month,
      ers.base_currency as baseCurrency,
      SUM(o.total_selling_amount) as totalAll,
      SUM(CASE WHEN co.payment_status = 'UNPAID' THEN o.total_selling_amount ELSE 0 END) as totalUnpaid,
      SUM(CASE WHEN co.payment_status = 'PAID' THEN o.total_selling_amount ELSE 0 END) as totalPaid,
      ers.rate as rate
    FROM orders o
    LEFT JOIN customer_orders co ON co.order_id = o.id
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
        const monthMap = {};
        const cursor = new Date(startDate);
        cursor.setDate(1);
        while (cursor.getFullYear() < endDate.getFullYear() ||
            (cursor.getFullYear() === endDate.getFullYear() &&
                cursor.getMonth() <= endDate.getMonth())) {
            const key = `${cursor.getFullYear()}-${cursor.getMonth() + 1}`;
            monthMap[key] = {
                year: cursor.getFullYear(),
                month: cursor.getMonth() + 1,
                buyRows: [],
                sellRows: [],
            };
            cursor.setMonth(cursor.getMonth() + 1);
        }
        for (const r of buyRows) {
            const key = `${Number(r.year)}-${Number(r.month)}`;
            if (monthMap[key])
                monthMap[key].buyRows.push(r);
        }
        for (const r of sellRows) {
            const key = `${Number(r.year)}-${Number(r.month)}`;
            if (monthMap[key])
                monthMap[key].sellRows.push(r);
        }
        let totalLakAll = 0;
        let totalLakUnpaid = 0;
        let totalLakPaid = 0;
        const months = Object.values(monthMap).map(({ year, month, buyRows, sellRows }) => {
            let lakTotalAll = 0;
            let lakTotalUnpaid = 0;
            let lakTotalPaid = 0;
            const currencyMap = new Map();
            const processRow = (type, r) => {
                const baseCurrency = r.baseCurrency;
                const totalAll = Number(r.totalAll ?? 0);
                const totalUnpaid = Number(r.totalUnpaid ?? 0);
                const totalPaid = Number(r.totalPaid ?? 0);
                const rate = Number(r.rate ?? 1);
                const key = `${type}-${baseCurrency}`;
                if (!currencyMap.has(key)) {
                    currencyMap.set(key, {
                        type,
                        baseCurrency,
                        totalAll: 0,
                        totalUnpaid: 0,
                        totalPaid: 0,
                    });
                }
                const existing = currencyMap.get(key);
                existing.totalAll += totalAll;
                existing.totalUnpaid += totalUnpaid;
                existing.totalPaid += totalPaid;
                if (baseCurrency === "LAK") {
                    lakTotalAll += totalAll;
                    lakTotalUnpaid += totalUnpaid;
                    lakTotalPaid += totalPaid;
                }
                else {
                    lakTotalAll += totalAll * rate;
                    lakTotalUnpaid += totalUnpaid * rate;
                    lakTotalPaid += totalPaid * rate;
                }
            };
            for (const r of buyRows)
                processRow("BUY", r);
            for (const r of sellRows)
                processRow("SELL", r);
            totalLakAll += lakTotalAll;
            totalLakUnpaid += lakTotalUnpaid;
            totalLakPaid += lakTotalPaid;
            return {
                year,
                month,
                currencies: Array.from(currencyMap.values()),
                summary: {
                    targetCurrency: "LAK",
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
                targetCurrency: "LAK",
                totalAll: totalLakAll,
                totalUnpaid: totalLakUnpaid,
                totalPaid: totalLakPaid,
            },
        };
    }
    async getTopCustomersByBuyOrder(merchantId) {
        const query = `
    SELECT 
      c.id as customerId,
      c.customer_name as customerName,
      COALESCE(c.contact_phone, '') as customerEmail,
      COALESCE(SUM(o.total_final_cost), 0) as totalBuyAmountLak,
      COUNT(o.id) as orderCount,
      COALESCE(AVG(o.total_final_cost), 0) as averageOrderAmountLak
    FROM customers c
    INNER JOIN customer_orders co ON co.customer_id = c.id
    INNER JOIN orders o ON o.id = co.order_id
    WHERE o.merchant_id = ?
      AND c.is_active = 1
    GROUP BY c.id, c.customer_name, c.contact_phone
    ORDER BY totalBuyAmountLak DESC
    LIMIT 5
  `;
        const results = await this.dataSource.query(query, [merchantId]);
        const customers = results.map((result, index) => ({
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
};
exports.DashboardQueryService = DashboardQueryService;
exports.DashboardQueryService = DashboardQueryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], DashboardQueryService);
//# sourceMappingURL=dashboard-query.service.js.map