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
      relations: ['order', 'customer', 'customerOrderItems', 'customerOrderItems.orderItemSku', 'customerOrderItems.orderItemSku.orderItem', 'customerOrderItems.orderItemSku.exchangeRateBuy', 'customerOrderItems.orderItemSku.exchangeRateSell'],
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

    // Build query conditions dynamically
    let whereConditions = ['c.unique_token = ?'];
    let queryParams: any[] = [dto.customerToken];
    
    if (dto.notificationToken) {
      whereConditions.push('n.unique_token = ?');
      queryParams.push(dto.notificationToken);
    }

    const query = `
SELECT 
  COALESCE(er.base_currency, 'LAK') as baseCurrency,

  SUM(ois.selling_total) as totalAll,

  SUM(
    CASE WHEN co.payment_status = 'UNPAID'
    THEN ois.selling_total ELSE 0 END
  ) as totalUnpaid,

  SUM(
    CASE WHEN co.payment_status = 'PAID'
    THEN ois.selling_total ELSE 0 END
  ) as totalPaid,

  COALESCE(er.rate, 1) as rate

FROM customers c

JOIN customer_orders co
  ON co.customer_id = c.id

JOIN customer_order_items coi
  ON coi.customer_order_id = co.id

JOIN order_item_skus ois
  ON ois.id = coi.order_item_sku_id

LEFT JOIN notifications n
  ON n.id = co.notification_id

LEFT JOIN exchange_rates er
  ON er.id = ois.exchange_rate_sell_id

WHERE
  ${whereConditions.join(' AND ')}

GROUP BY
  er.base_currency,
  er.rate
`;

    const rows = await this.dataSource.query(query, queryParams);

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
      customerName: entity.customer?.customerName || '',
      customerToken: entity.customer?.uniqueToken || '',
      totalSellingAmount: entity.totalSellingAmount,
      totalPaid: entity.totalPaid,
      remainingAmount: entity.remainingAmount,
      targetCurrencyTotalSellingAmount: convertToTargetCurrency(entity.totalSellingAmount, entity.order?.exchangeRateSell),
      targetCurrencyTotalPaid: convertToTargetCurrency(entity.totalPaid, entity.order?.exchangeRateSell),
      targetCurrencyRemainingAmount: convertToTargetCurrency(entity.remainingAmount, entity.order?.exchangeRateSell),
      paymentStatus: entity.paymentStatus,
      hasPendingPayment: entity.paymentStatus === 'UNPAID',
      customerOrderItems: entity.customerOrderItems?.map(item => {
        console.log('=== BACKEND: Processing CustomerOrderItem ===');
        console.log('item.id:', item.id);
        console.log('item.orderItemSku?.id:', item.orderItemSku?.id);
        console.log('item.orderItemSku?.orderItem?.id:', item.orderItemSku?.orderItem?.id);
        console.log('item.orderItemSku?.orderItem?.productName:', item.orderItemSku?.orderItem?.productName);
        
        return {
          id: item.id,
          orderItemSkuId: item.orderItemSku?.id ?? 0,
          variant: item.orderItemSku?.variant || null,
          quantity: item.quantity,
          exchangeRateBuy: item.orderItemSku?.exchangeRateBuy || null,
          exchangeRateSell: item.orderItemSku?.exchangeRateSell || null,
          exchangeRateBuyValue: item.orderItemSku?.exchangeRateBuyValue || null,
          exchangeRateSellValue: item.orderItemSku?.exchangeRateSellValue || null,
          sellingPriceForeign: item.sellingPriceForeign,
          purchasePrice: item.purchasePrice,
          purchaseTotal: item.purchaseTotal,
          sellingTotal: item.sellingTotal,
          profit: item.profit,
          targetCurrencySellingPriceForeign: convertToTargetCurrency(item.sellingPriceForeign, item.orderItemSku?.exchangeRateSell),
          targetCurrencySellingTotal: convertToTargetCurrency(item.sellingTotal, item.orderItemSku?.exchangeRateSell),
          productName: item.orderItemSku?.orderItem?.productName || null,
          orderItemId: item.orderItemSku?.orderItem?.id || null,
        };
      }) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }


}
