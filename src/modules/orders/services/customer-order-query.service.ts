import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerOrderQueryRepository } from '../repositories/customer-order.query-repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderListQueryDto, TokenQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { convertToTargetCurrency } from 'src/common/utils/convert-to-target-currency.utils';
// import { PaymentVerificationStatusEnum } from '../../payments/enum/payment.enum';
// import { PaymentOrmEntity } from '../../payments/entities/payment.orm-entity';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomerOrderQueryService {
  constructor(
    private readonly customerOrderRepository: CustomerOrderRepository,
    private readonly customerOrderQueryRepository: CustomerOrderQueryRepository,
    private readonly dataSource: DataSource
  ) { }

  async getById(id: number): Promise<CustomerOrderResponseDto | null> {
    const entity = await this.customerOrderQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'customer', 'customerOrderItems', 'customerOrderItems.orderItem'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<CustomerOrderResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Customer order not found');
    return createSingleResponse(dto);
  }

  async getList(query: CustomerOrderListQueryDto): Promise<ResponseWithPaginationInterface<CustomerOrderResponseDto>> {
    const result = await this.customerOrderQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      orderId: query.orderId,
      customerOrderId: query.customerOrderId,
      customerId: query.customerId,
      customerToken: query.customerToken,
      notificationToken: query.notificationToken,
      customerName: query.customerName,
      isArrived: query.isArrived,
      startDate: query.startDate,
      endDate: query.endDate,
      paymentStatus: query.paymentStatus,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  async getSummary(dto: TokenQueryDto): Promise<any[]> {

    const query = `
SELECT 
  er.base_currency as baseCurrency,

  SUM(oi.selling_total) as totalAll,

  SUM(
    CASE WHEN co.payment_status = 'UNPAID'
    THEN oi.selling_total ELSE 0 END
  ) as totalUnpaid,

  SUM(
    CASE WHEN co.payment_status = 'PAID'
    THEN oi.selling_total ELSE 0 END
  ) as totalPaid,

  er.rate as rate

FROM notifications n

JOIN customers c
  ON c.id = n.customer_id

JOIN customer_orders co
  ON co.notification_id = n.id

JOIN customer_order_items coi
  ON coi.customer_order_id = co.id

JOIN order_items oi
  ON oi.id = coi.order_item_id

LEFT JOIN exchange_rates er
  ON er.id = oi.exchange_rate_sell_id

WHERE
  c.unique_token = ?
  AND n.unique_token = ?
  AND JSON_CONTAINS(n.related_orders, CAST(co.id AS JSON))

GROUP BY
  er.base_currency,
  er.rate
`;

    const rows = await this.dataSource.query(query, [
      dto.customerToken,
      dto.notificationToken
    ]);

    let lakTotalAll = 0;
    let lakTotalUnpaid = 0;
    let lakTotalPaid = 0;

    const grouped = new Map<string, any>();

    for (const r of rows) {
      const baseCurrency = r.baseCurrency;
      const totalAll = Number(r.totalAll ?? 0);
      const totalUnpaid = Number(r.totalUnpaid ?? 0);
      const totalPaid = Number(r.totalPaid ?? 0);
      const rate = Number(r.rate ?? 1);

      lakTotalAll += totalAll * rate;
      lakTotalUnpaid += totalUnpaid * rate;
      lakTotalPaid += totalPaid * rate;

      if (grouped.has(baseCurrency)) {
        const existing = grouped.get(baseCurrency);
        existing.totalAll += totalAll;
        existing.totalUnpaid += totalUnpaid;
        existing.totalPaid += totalPaid;
      } else {
        grouped.set(baseCurrency, {
          baseCurrency,
          totalAll,
          totalUnpaid,
          totalPaid
        });
      }
    }

    const result = Array.from(grouped.values());

    result.push({
      targetCurrency: "LAK",
      totalAll: lakTotalAll,
      totalUnpaid: lakTotalUnpaid,
      totalPaid: lakTotalPaid
    });

    return result;
  }

  private toResponse(entity: import('../entities/customer-order.orm-entity').CustomerOrderOrmEntity): CustomerOrderResponseDto {
    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      orderCode: entity.order?.orderCode ?? null,
      customerId: entity.customer?.id ?? 0,
      customerName: entity.customer?.contactLine || '',
      customerToken: entity.customer?.uniqueToken || '',
      totalSellingAmount: entity.totalSellingAmount,
      totalPaid: entity.totalPaid,
      remainingAmount: entity.remainingAmount,
      targetCurrencyTotalSellingAmount: convertToTargetCurrency(entity.totalSellingAmount, entity.order?.exchangeRateSell),
      targetCurrencyTotalPaid: convertToTargetCurrency(entity.totalPaid, entity.order?.exchangeRateSell),
      targetCurrencyRemainingAmount: convertToTargetCurrency(entity.remainingAmount, entity.order?.exchangeRateSell),
      paymentStatus: entity.paymentStatus,
      
      customerOrderItems: entity.customerOrderItems?.map(item => ({
        id: item.id,
        orderItemId: item.orderItem?.id ?? 0,
        productName: item.orderItem?.productName || '',
        variant: item.orderItem?.variant || null,
        quantity: item.quantity,
        exchangeRateBuy: entity.order?.exchangeRateBuy || null,
        exchangeRateSell: entity.order?.exchangeRateSell || null,
        exchangeRateBuyValue: entity.order?.exchangeRateBuy?.rate || null,
        exchangeRateSellValue: entity.order?.exchangeRateSell?.rate || null,
        image: item.orderItem?.image || null,
        sellingPriceForeign: item.sellingPriceForeign,
        sellingTotal: item.sellingTotal,
        targetCurrencySellingPriceForeign: convertToTargetCurrency(item.sellingPriceForeign, item.orderItem?.exchangeRateSell),
        targetCurrencySellingTotal: convertToTargetCurrency(item.sellingTotal, item.orderItem?.exchangeRateSell),
      })) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }


}
