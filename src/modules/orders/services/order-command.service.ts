import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderItemRepository } from '../repositories/customer-order-item.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { CustomerRepository } from '../../customers/repositories/customer.repository';
import { CreateFullOrderDto } from '../dto/create-full-order.dto';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderUpdateDto } from '../dto/order-update.dto';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import { ExchangeRateOrmEntity } from '../../exchange-rates/entities/exchange-rate.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { ArrivalStatusEnum } from '../enum/enum.entities';

const ZERO = '0';
const LAK = 'LAK';
const THB = 'THB';

function toDecimal(v: number): string {
  return String(Number(v.toFixed(4)));
}

function toDecimal2(v: number): string {
  return String(Number(v.toFixed(2)));
}

function calcPaymentStatus(total: number, paid: number): 'UNPAID' | 'PARTIAL' | 'PAID' {
  if (paid <= 0) return 'UNPAID';
  if (paid >= total) return 'PAID';
  return 'PARTIAL';
}

@Injectable()
export class OrderCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly customerOrderRepository: CustomerOrderRepository,
    private readonly customerOrderItemRepository: CustomerOrderItemRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly customerRepository: CustomerRepository,
  ) {}

  async create(
    dto: OrderCreateDto,
    createdByUserId: number | null,
  ): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(dto.merchantId, manager);
      if (!merchant) throw new NotFoundException('Merchant not found');
      const orderDate = new Date(dto.orderDate);
      const shippingLak = dto.totalShippingCostLak ?? 0;
      const entity = await this.orderRepository.create(
        {
          merchant,
          createdByUser: createdByUserId ? ({ id: createdByUserId } as any) : null,
          orderCode: dto.orderCode,
          orderDate,
          arrivalStatus: dto.arrivalStatus ?? 'NOT_ARRIVED',
          totalShippingCostLak: toDecimal2(shippingLak),
          totalPurchaseCostLak: ZERO,
          totalCostBeforeDiscountLak: ZERO,
          totalDiscountLak: ZERO,
          totalFinalCostLak: ZERO,
          totalFinalCostThb: ZERO,
          totalSellingAmountLak: ZERO,
          totalSellingAmountThb: ZERO,
          totalProfitLak: ZERO,
          totalProfitThb: ZERO,
          depositAmount: ZERO,
          paidAmount: ZERO,
          remainingAmount: ZERO,
          paymentStatus: 'UNPAID',
        } as Partial<OrderOrmEntity>,
        manager,
      );
      return { id: entity.id };
    });
  }

  async update(id: number, dto: OrderUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.orderRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Order not found');
      const updateData: Partial<OrderOrmEntity> = {};
      if (dto.orderCode !== undefined) updateData.orderCode = dto.orderCode;
      if (dto.orderDate !== undefined) updateData.orderDate = new Date(dto.orderDate);
    if (dto.arrivedAt !== undefined) updateData.arrivedAt = dto.arrivedAt ? new Date(dto.arrivedAt) : null;
      if (dto.notifiedAt !== undefined) updateData.notifiedAt = dto.notifiedAt ? new Date(dto.notifiedAt) : null;
      if (dto.totalShippingCostLak !== undefined) updateData.totalShippingCostLak = toDecimal2(dto.totalShippingCostLak);
     if (dto.depositAmount !== undefined) updateData.depositAmount = toDecimal2(dto.depositAmount);
      if (dto.paidAmount !== undefined) {
        updateData.paidAmount = toDecimal2(dto.paidAmount);
        const totalSelling = Number(existing.totalSellingAmountLak);
        const paid = dto.paidAmount;
        updateData.remainingAmount = toDecimal2(Math.max(0, totalSelling - paid));
   }
      await this.orderRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.orderRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Order not found');
      await this.orderRepository.delete(id, manager);
    });
  }

  async createFull(
    dto: CreateFullOrderDto,
    currentUser: CurrentUserPayload
  ): Promise<{ success: true; order: object; message: string }> {
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(currentUser.merchantId!, manager);
      if (!merchant) throw new NotFoundException('Merchant not found');

      const orderDate = new Date();
      const shippingLak = dto.totalShippingCostLak ?? 0;

      const repo = (m: EntityManager) => m.getRepository(ExchangeRateOrmEntity);

      const getBuyRate = async (baseCurrency: string, m: EntityManager) => {
        if (baseCurrency === LAK) return 1;
        const er = await repo(m)
          .createQueryBuilder('er')
          .innerJoin('er.merchant', 'merchant')
          .where('merchant.id = :merchantId', { merchantId: currentUser.merchantId! })
          .andWhere('er.rateDate <= :rateDate', { rateDate: orderDate })
          .andWhere('er.baseCurrency = :base', { base: baseCurrency })
          .andWhere('er.targetCurrency = :target', { target: LAK })
          .andWhere('er.rateType = :type', { type: 'BUY' })
          .andWhere('er.isActive = :active', { active: true })
          .orderBy('er.rateDate', 'DESC')
          .getOne();
        return er ? Number(er.rate) : 1;
      };
      const getSellRate = async (baseCurrency: string, m: EntityManager) => {
        if (baseCurrency === LAK) return 1;
        const er = await repo(m)
          .createQueryBuilder('er')
          .innerJoin('er.merchant', 'merchant')
          .where('merchant.id = :merchantId', { merchantId: currentUser.merchantId! })
          .andWhere('er.rateDate <= :rateDate', { rateDate: orderDate })
          .andWhere('er.baseCurrency = :base', { base: baseCurrency })
          .andWhere('er.targetCurrency = :target', { target: LAK })
          .andWhere('er.rateType = :type', { type: 'SELL' })
          .andWhere('er.isActive = :active', { active: true })
          .orderBy('er.rateDate', 'DESC')
          .getOne();
        return er ? Number(er.rate) : 1;
      };

      // 2) Create Order (totals 0 for now)
      const order = await this.orderRepository.create(
        {
          merchant,
          createdByUser: currentUser ? { id: currentUser.userId } : null,
          orderCode: dto.orderCode,
          orderDate,
          arrivalStatus: ArrivalStatusEnum.NOT_ARRIVED,
          totalPurchaseCostLak: ZERO,
          totalShippingCostLak: toDecimal2(shippingLak),
          totalCostBeforeDiscountLak: ZERO,
          totalDiscountLak: ZERO,
          totalFinalCostLak: ZERO,
          totalFinalCostThb: ZERO,
          totalSellingAmountLak: ZERO,
          totalSellingAmountThb: ZERO,
          totalProfitLak: ZERO,
          totalProfitThb: ZERO,
          depositAmount: ZERO,
          paidAmount: ZERO,
          remainingAmount: ZERO,
          paymentStatus: 'UNPAID',
        } as Partial<OrderOrmEntity>,
        manager,
      );

      // 3) Create Order Items with rates and calculations
      const orderItems: OrderItemOrmEntity[] = [];
      for (let i = 0; i < dto.items.length; i++) {
        const it = dto.items[i];
        const buyRate = await getBuyRate(it.purchaseCurrency, manager);
        const sellRate = await getSellRate(it.purchaseCurrency, manager);

        const purchaseTotalLak = it.purchasePrice * it.quantity * buyRate;
        const costBeforeDiscount = purchaseTotalLak;
        let discountLak = 0;
        if (it.discountType && it.discountValue != null) {
          if (it.discountType === 'PERCENT') {
            discountLak = (costBeforeDiscount * it.discountValue) / 100;
          } else {
            discountLak = it.discountValue;
          }
        }
        const finalCostLak = costBeforeDiscount - discountLak;
        const sellingTotalLak = it.sellingPriceForeign * it.quantity * sellRate;
        const profitLak = sellingTotalLak - (finalCostLak / it.quantity) * it.quantity;
        const sellRateThb = await getSellRate(THB, manager);

        const itemEntity = await this.orderItemRepository.create(
          {
            order,
            orderId: order.id,
            orderItemIndex: i,
            productName: it.productName,
            variant: it.variant ?? null,
            quantity: it.quantity,
            quantityRemaining: it.quantity,
            purchaseCurrency: it.purchaseCurrency,
            purchasePrice: toDecimal(it.purchasePrice),
            purchaseExchangeRate: toDecimal(buyRate),
            purchaseTotalLak: toDecimal2(purchaseTotalLak),
            totalCostBeforeDiscountLak: toDecimal2(costBeforeDiscount),
            discountType: it.discountType ?? null,
            discountValue: it.discountValue != null ? toDecimal(it.discountValue) : null,
            discountAmountLak: toDecimal2(discountLak),
            finalCostLak: toDecimal2(finalCostLak),
            finalCostThb: toDecimal2(sellRateThb > 0 ? finalCostLak / sellRateThb : 0),
            sellingPriceForeign: toDecimal(it.sellingPriceForeign),
            sellingExchangeRate: toDecimal(sellRate),
            sellingTotalLak: toDecimal2(sellingTotalLak),
            profitLak: toDecimal2(profitLak),
            profitThb: toDecimal2(sellRateThb > 0 ? profitLak / sellRateThb : 0),
          } as Partial<OrderItemOrmEntity>,
          manager,
        );
        orderItems.push(itemEntity);
      }

      // 4) Stock check: aggregate requested qty per order item
      const requestedByOrderItem: number[] = dto.items.map(() => 0);
      for (const co of dto.customerOrders) {
        for (const coItem of co.items) {
          const idx = coItem.orderItemIndex;
          if (idx < 0 || idx >= orderItems.length) {
            throw new BadRequestException(`Invalid orderItemIndex ${idx}`);
          }
          requestedByOrderItem[idx] += coItem.quantity;
        }
      }
      for (let i = 0; i < orderItems.length; i++) {
        if (requestedByOrderItem[i] > orderItems[i].quantity) {
          throw new BadRequestException(
            `Insufficient stock for item "${dto.items[i].productName}": requested ${requestedByOrderItem[i]}, available ${orderItems[i].quantity}`,
          );
        }
      }

      // 5) Create Customer Orders and Customer Order Items
      const customerOrders: CustomerOrderOrmEntity[] = [];
      const sellRatesByCurrency: Record<string, number> = {};

      for (const coDto of dto.customerOrders) {
        const customer = await this.customerRepository.findOneById(coDto.customerId, manager);
        if (!customer) throw new NotFoundException(`Customer not found: ${coDto.customerId}`);

        let totalSellingAmountLak = 0;
        const coItemsToCreate: { orderItem: OrderItemOrmEntity; quantity: number; sellingPriceForeign: number }[] = [];

        for (const coItemDto of coDto.items) {
          const orderItem = orderItems[coItemDto.orderItemIndex];
          const sellingPrice = coItemDto.sellingPriceForeign ?? Number(orderItem.sellingPriceForeign);
          const currency = orderItem.purchaseCurrency;
          if (!sellRatesByCurrency[currency]) {
            sellRatesByCurrency[currency] = await getSellRate(currency, manager);
          }
          const rate = sellRatesByCurrency[currency];
          const lineTotalLak = coItemDto.quantity * Number(sellingPrice) * rate;
          totalSellingAmountLak += lineTotalLak;
          coItemsToCreate.push({
            orderItem,
            quantity: coItemDto.quantity,
            sellingPriceForeign: Number(sellingPrice),
          });
        }

        const totalPaid = 0;
        const remaining = totalSellingAmountLak - totalPaid;
        const paymentStatus = calcPaymentStatus(totalSellingAmountLak, totalPaid);

        const customerOrder = await this.customerOrderRepository.create(
          {
            order,
            customer,
            totalSellingAmountLak: toDecimal2(totalSellingAmountLak),
            totalPaid: toDecimal2(totalPaid),
            remainingAmount: toDecimal2(remaining),
            paymentStatus,
          } as Partial<CustomerOrderOrmEntity>,
          manager,
        );
        customerOrders.push(customerOrder);

        for (const coItem of coItemsToCreate) {
          const currency = coItem.orderItem.purchaseCurrency;
          const rate = sellRatesByCurrency[currency] ?? await getSellRate(currency, manager);
          const sellingTotalLak = coItem.quantity * coItem.sellingPriceForeign * rate;
          const costPerUnit = Number(coItem.orderItem.finalCostLak) / coItem.orderItem.quantity;
          const costAllocated = costPerUnit * coItem.quantity;
          const profitLak = sellingTotalLak - costAllocated;

          await this.customerOrderItemRepository.create(
            {
              customerOrder,
              orderItem: coItem.orderItem,
              quantity: coItem.quantity,
              sellingPriceForeign: toDecimal(coItem.sellingPriceForeign),
              sellingTotalLak: toDecimal2(sellingTotalLak),
              profitLak: toDecimal2(profitLak),
            } as Partial<CustomerOrderItemOrmEntity>,
            manager,
          );

          // Decrement stock
          const newRemaining = coItem.orderItem.quantityRemaining - coItem.quantity;
          await this.orderItemRepository.update(
            coItem.orderItem.id,
            { quantityRemaining: newRemaining } as Partial<OrderItemOrmEntity>,
            manager,
          );
          coItem.orderItem.quantityRemaining = newRemaining;
        }
      }

      // 6) Re-load order items with updated quantity_remaining and compute order totals
      let totalPurchaseCostLak = 0;
      let totalCostBeforeDiscountLak = 0;
      let totalDiscountLak = 0;
      let totalFinalCostLak = 0;
      let totalSellingAmountLak = 0;
      for (const oi of orderItems) {
        totalPurchaseCostLak += Number(oi.purchaseTotalLak);
        totalCostBeforeDiscountLak += Number(oi.totalCostBeforeDiscountLak);
        totalDiscountLak += Number(oi.discountAmountLak);
        totalFinalCostLak += Number(oi.finalCostLak);
      }
      for (const co of customerOrders) {
        totalSellingAmountLak += Number(co.totalSellingAmountLak);
      }
      const totalProfitLak = totalSellingAmountLak - totalFinalCostLak;
      const sellRateThb = await getSellRate(THB, manager);
      const totalFinalCostThb = sellRateThb > 0 ? totalFinalCostLak / sellRateThb : 0;
      const totalSellingAmountThb = sellRateThb > 0 ? totalSellingAmountLak / sellRateThb : 0;
      const totalProfitThb = sellRateThb > 0 ? totalProfitLak / sellRateThb : 0;

      let paidAmount = 0;
      for (const co of customerOrders) {
        paidAmount += Number(co.totalPaid);
      }
      const remainingAmount = totalSellingAmountLak - paidAmount;
      const orderPaymentStatus = calcPaymentStatus(totalSellingAmountLak, paidAmount);

      await this.orderRepository.update(
        order.id,
        {
          totalPurchaseCostLak: toDecimal2(totalPurchaseCostLak),
          totalShippingCostLak: toDecimal2(shippingLak),
          totalCostBeforeDiscountLak: toDecimal2(totalCostBeforeDiscountLak),
          totalDiscountLak: toDecimal2(totalDiscountLak),
          totalFinalCostLak: toDecimal2(totalFinalCostLak),
          totalFinalCostThb: toDecimal2(totalFinalCostThb),
          totalSellingAmountLak: toDecimal2(totalSellingAmountLak),
          totalSellingAmountThb: toDecimal2(totalSellingAmountThb),
          totalProfitLak: toDecimal2(totalProfitLak),
          totalProfitThb: toDecimal2(totalProfitThb),
          paidAmount: toDecimal2(paidAmount),
          remainingAmount: toDecimal2(remainingAmount),
          paymentStatus: orderPaymentStatus,
        } as Partial<OrderOrmEntity>,
        manager,
      );

      // Load full order for response
      const orderReloaded = await this.orderRepository.getRepo(manager).findOne({
        where: { id: order.id },
        relations: [
          'orderItems',
          'customerOrders',
          'customerOrders.customerOrderItems',
          'customerOrders.customerOrderItems.orderItem',
          'customerOrders.customer',
        ],
      });

      return {
        success: true,
        order: orderReloaded ?? order,
        message: 'Order created successfully',
      };
    });
  }
}
