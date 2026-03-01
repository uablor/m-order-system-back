import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomerOrderQueryRepository } from '../repositories/customer-order.query-repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderListQueryDto } from '../dto/customer-order-list-query.dto';
import { CustomerOrderResponseDto } from '../dto/customer-order-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { ExchangeRateOrmEntity } from '../../exchange-rates/entities/exchange-rate.orm-entity';

@Injectable()
export class CustomerOrderQueryService {
  constructor(
    private readonly customerOrderRepository: CustomerOrderRepository,
    private readonly customerOrderQueryRepository: CustomerOrderQueryRepository,
  ) {}

  async getById(id: number): Promise<CustomerOrderResponseDto | null> {
    const entity = await this.customerOrderQueryRepository.repository.findOne({
      where: { id },
      relations: ['order', 'order.exchangeRateSell', 'customer', 'customerOrderItems', 'customerOrderItems.orderItem', 'payments'],
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
      customerId: query.customerId,
      customerToken: query.customerToken,
      customerName: query.customerName,
      startDate: query.startDate,
      endDate: query.endDate,
    });
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private convertToTargetCurrency(amount: number, exchangeRate: ExchangeRateOrmEntity | null): string {
    if (!exchangeRate) return amount.toString();
    if (exchangeRate.baseCurrency === exchangeRate.targetCurrency) return amount.toString();
    if (exchangeRate.rateType === 'BUY') {
      return (amount * exchangeRate.rate).toString();
    }
    return (amount * exchangeRate.rate).toString();
  }

  private toResponse(entity: import('../entities/customer-order.orm-entity').CustomerOrderOrmEntity): CustomerOrderResponseDto {
    const exchangeRateSell = entity.order?.exchangeRateSell ?? null;
    const targetCurrency = exchangeRateSell?.targetCurrency ?? null;
    const hasPendingPayment = (entity.payments ?? []).some((p) => p.status === 'PENDING');

    return {
      id: entity.id,
      orderId: entity.order?.id ?? 0,
      customerId: entity.customer?.id ?? 0,
      customerName: entity.customer?.contactLine || '',
      customerToken: entity.customer?.uniqueToken || '',
      totalSellingAmount: entity.totalSellingAmount.toString(),
      totalPaid: entity.totalPaid.toString(),
      remainingAmount: entity.remainingAmount.toString(),
      paymentStatus: entity.paymentStatus,
      targetCurrency,
      targetCurrencyTotalSellingAmount: targetCurrency ? this.convertToTargetCurrency(entity.totalSellingAmount, exchangeRateSell) : null,
      targetCurrencyTotalPaid: targetCurrency ? this.convertToTargetCurrency(entity.totalPaid, exchangeRateSell) : null,
      targetCurrencyRemainingAmount: targetCurrency ? this.convertToTargetCurrency(entity.remainingAmount, exchangeRateSell) : null,
      hasPendingPayment,
      customerOrderItems: entity.customerOrderItems?.map(item => ({
        id: item.id,
        orderId: item.orderItem?.id ?? 0,
        productName: item.orderItem?.productName || '',
        variant: item.orderItem?.variant ?? null,
        quantity: item.quantity,
        sellingPriceForeign: item.sellingPriceForeign.toString(),
        sellingTotal: item.sellingTotal.toString(),
        targetCurrencySellingTotal: targetCurrency ? this.convertToTargetCurrency(item.sellingTotal, exchangeRateSell) : null,
        profit: item.profit.toString(),
      })) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
