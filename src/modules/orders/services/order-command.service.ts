import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { CustomerOrderRepository } from '../repositories/customer-order.repository';
import { CustomerOrderItemRepository } from '../repositories/customer-order-item.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { CustomerRepository } from '../../customers/repositories/customer.repository';
import { ExchangeRateQueryRepository } from '../../exchange-rates/repositories/exchange-rate.query-repository';
import { CreateFullOrderDto } from '../dto/create-full-order.dto';
import { OrderCreateDto } from '../dto/order-create.dto';
import { OrderUpdateDto } from '../dto/order-update.dto';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { ArrivalStatusEnum, PaymentStatusEnum } from '../enum/enum.entities';

const ZERO = 0;

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
    private readonly exchangeRateQueryRepository: ExchangeRateQueryRepository,
  ) {}

  async create(
    dto: OrderCreateDto,
    createdByUserId: number | null,
  ): Promise<{ id: number }> {
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(dto.merchantId, manager);
      if (!merchant) throw new NotFoundException('Merchant not found');
      const orderDate = new Date(dto.orderDate);
      const shippingCost = dto.totalShippingCost ?? 0;
      const entity = await this.orderRepository.create(
        {
          merchant,
          createdByUser: createdByUserId ? ({ id: createdByUserId } as any) : null,
          orderCode: dto.orderCode,
          orderDate,
          arrivalStatus: dto.arrivalStatus ?? 'NOT_ARRIVED',
          totalShippingCost: shippingCost,
          totalPurchaseCost: ZERO,
          totalCostBeforeDiscount: ZERO,
          totalDiscount: ZERO,
          totalFinalCost: ZERO,
          totalSellingAmount: ZERO,
          totalProfit: ZERO,
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
      if (dto.totalShippingCost !== undefined) updateData.totalShippingCost = (dto.totalShippingCost);
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
    currentUser: CurrentUserPayload,
  ): Promise<{ success: true; order: object; message: string }> {
    return this.transactionService.run(async (manager) => {
      const merchant = await this.merchantRepository.findOneById(currentUser.merchantId!, manager);
      if (!merchant) throw new NotFoundException('Merchant not found');

      const orderDate = new Date();

      // ดึง BUY/SELL rate ของ merchant จาก DB สำหรับวันนี้
      const { buy: buyRateEntity, sell: sellRateEntity } =
        await this.exchangeRateQueryRepository.findTodayRates(currentUser.merchantId!);
      if (!buyRateEntity) {
        throw new BadRequestException('BUY exchange rate not found');
      }
      if (!sellRateEntity) {
        throw new BadRequestException('SELL exchange rate not found');
      }
      // 1) สร้าง Order header (totals จะ update ทีหลัง)
      const order = await this.orderRepository.create(
        {
          merchant,
          createdByUser: currentUser ? { id: currentUser.userId } : null,
          orderCode: dto.orderCode,
          orderDate,
          exchangeRateBuy: buyRateEntity,
          exchangeRateSell: sellRateEntity,
          exchangeRateBuyValue: Number(buyRateEntity.rate),
          exchangeRateSellValue: Number(sellRateEntity.rate),
          arrivalStatus: ArrivalStatusEnum.NOT_ARRIVED,
          totalPurchaseCost: ZERO,
          totalShippingCost: ZERO,
          totalCostBeforeDiscount: ZERO,
          totalDiscount: ZERO,
          totalFinalCost: ZERO,
          totalSellingAmount: ZERO,
          totalProfit: ZERO,
          paymentStatus: PaymentStatusEnum.UNPAID,
        } as Partial<OrderOrmEntity>,
        manager,
      );

      // 2) สร้าง Order Items ด้วย exchange rate จาก DB
      const orderItems: OrderItemOrmEntity[] = [];
      for (let i = 0; i < dto.items.length; i++) {
        const it = dto.items[i];
        const shippingPriceInput = it.shippingPrice ?? 0;

        // Use values directly from DTO without exchange rate calculations
        const purchaseTotal = it.purchasePrice * it.quantity;
        const shippingTotal = shippingPriceInput;
        const subtotal = purchaseTotal + shippingTotal;
        
        // Calculate discount based on DTO values
        let discount = 0;
        if (it.discountType && it.discountValue != null) {
          if (it.discountType === 'percent') {
            discount = subtotal * (it.discountValue / 100);
          } else {
            discount = it.discountValue;
          }
        }
        
        const finalCost = subtotal - discount;
        const sellPrice = it.sellingPriceForeign * it.quantity;
        const profit = sellPrice - finalCost;


        // map discountType: 'percent' → 'PERCENT', 'cash' → 'FIX'
        const entityDiscountType = it.discountType === 'percent' ? 'PERCENT' : it.discountType === 'cash' ? 'FIX' : null;

        const itemEntity = await this.orderItemRepository.create(
          {
            order,
            orderItemIndex: i,
            productName: it.productName,
            variant: it.variant ?? null,
            quantity: it.quantity,
            exchangeRateBuy: buyRateEntity,
            exchangeRateSell: sellRateEntity,
            exchangeRateBuyValue: Number(buyRateEntity.rate),
            exchangeRateSellValue: Number(sellRateEntity.rate),
            purchasePrice: Number(it.purchasePrice),
            purchaseTotal: Number(purchaseTotal),
            shippingPrice: Number(shippingPriceInput),
            totalCostBeforeDiscount: Number(subtotal),
            discountType: entityDiscountType, // 'PERCENT' or 'FIX'
            discountValue: it.discountValue != null ? it.discountValue : null,
            discountAmount: Number(discount),
            finalCost: Number(finalCost),
            sellingPriceForeign: Number(it.sellingPriceForeign),
            sellingTotal: Number(sellPrice),
            profit: Number(profit),
          } as Partial<OrderItemOrmEntity>,
          manager,
        );
        orderItems.push(itemEntity);
      }

      // 3) ตรวจสอบ stock: รวม qty ที่ customer orders ขอต่อ order item
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

      // 4) สร้าง Customer Orders และ Customer Order Items
      const customerOrders: CustomerOrderOrmEntity[] = [];

      for (const coDto of dto.customerOrders) {
        const customer = await this.customerRepository.findOneById(coDto.customerId, manager);
        if (!customer) throw new NotFoundException(`Customer not found: ${coDto.customerId}`);

        let totalSellingAmount = 0;
        const coItemsToCreate: {
          orderItem: OrderItemOrmEntity;
          quantity: number;
          sellingPriceForeign: number;
        }[] = [];

        for (const coItemDto of coDto.items) {
          const orderItem = orderItems[coItemDto.orderItemIndex];
          const sellingPrice = coItemDto.sellingPriceForeign ?? Number(orderItem.sellingPriceForeign);
          const lineTotal = coItemDto.quantity * sellingPrice;
          totalSellingAmount += lineTotal;
          coItemsToCreate.push({
            orderItem,
            quantity: coItemDto.quantity,
            sellingPriceForeign: sellingPrice,
          });
        }

        const totalPaid = 0;
        const remaining = totalSellingAmount - totalPaid;
        const paymentStatus = calcPaymentStatus(totalSellingAmount, totalPaid);

        const customerOrder = await this.customerOrderRepository.create(
          {
            order,
            customer,
            totalSellingAmount: totalSellingAmount,
            totalPaid: totalPaid,
            remainingAmount: remaining,
            paymentStatus,
          } as Partial<CustomerOrderOrmEntity>,
          manager,
        );
        customerOrders.push(customerOrder);

        for (const coItem of coItemsToCreate) {
          const sellingTotal = coItem.quantity * coItem.sellingPriceForeign;
          const costPerUnit = Number(coItem.orderItem.finalCost) / coItem.orderItem.quantity;
          const costAllocated = costPerUnit * coItem.quantity;
          const profit = sellingTotal - costAllocated;

          await this.customerOrderItemRepository.create(
            {
              customerOrder,
              orderItem: coItem.orderItem,
              quantity: coItem.quantity,
              sellingPriceForeign: coItem.sellingPriceForeign,
              sellingTotal: sellingTotal,
              profit: profit,
            } as Partial<CustomerOrderItemOrmEntity>,
            manager,
          );

          // Remove stock management logic since quantityRemaining no longer exists
        }
      }

      // 5) คำนวณ order-level totals โดย sum จาก items (ไม่ต้อง DB rate lookup)
      let totalPurchaseCost = 0;
      let totalShippingCost = 0;
      let totalCostBeforeDiscount = 0;
      let totalDiscount = 0;
      let totalFinalCost = 0;
      let totalSellingAmount = 0;
      let totalProfit = 0;

      for (const oi of orderItems) {
        totalPurchaseCost += Number(oi.purchaseTotal);
        totalShippingCost += Number(oi.shippingPrice);
        totalCostBeforeDiscount += Number(oi.totalCostBeforeDiscount);
        totalDiscount += Number(oi.discountAmount);
        totalFinalCost += Number(oi.finalCost);
        totalSellingAmount += Number(oi.sellingTotal);
        totalProfit += Number(oi.profit);
      }

      let paidAmount = 0;
      for (const co of customerOrders) {
        paidAmount += Number(co.totalPaid);
      }
      const remainingAmount = totalSellingAmount - paidAmount;
      const orderPaymentStatus = calcPaymentStatus(totalSellingAmount, paidAmount);

      await this.orderRepository.update(
        order.id,
        {
          totalPurchaseCost: totalPurchaseCost,
          totalShippingCost: totalShippingCost,
          totalCostBeforeDiscount: totalCostBeforeDiscount,
          totalDiscount: totalDiscount,
          totalFinalCost: totalFinalCost,
          totalSellingAmount: totalSellingAmount,
          totalProfit: totalProfit,
          paymentStatus: orderPaymentStatus,
        } as Partial<OrderOrmEntity>,
        manager,
      );

      // โหลด order พร้อม relations เพื่อ response
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
