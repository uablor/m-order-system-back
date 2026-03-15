import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { OrderRepository } from '../repositories/order.repository';
import { OrderItemRepository } from '../repositories/order-item.repository';
import { OrderItemSkuRepository } from '../repositories/order-item-sku.repository';
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
import { OrderItemSkuOrmEntity } from '../entities/order-item-sku.orm-entity';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { ArrivalStatusEnum } from '../enum/enum.entities';
import { convertToBaseCurrency, convertToTargetCurrency } from 'src/common/utils/convert-to-target-currency.utils';
import { PaymentStatusEnum } from 'src/modules/payments/enum/payment.enum';

const ZERO = 0;

function calcPaymentStatus(total: number, paid: number): 'NOT_CREATED' | 'UNPAID' | 'PARTIAL' | 'PAID' {
  if (paid <= 0) return 'NOT_CREATED';  // New orders with no payments
  if (paid >= total) return 'PAID';
  return 'PARTIAL';
}

@Injectable()
export class OrderCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly orderItemSkuRepository: OrderItemSkuRepository,
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
          paymentStatus: PaymentStatusEnum.NOT_CREATED,
        } as Partial<OrderOrmEntity>,
        manager,
      );

      // 2) สร้าง Order Items และ SKUs
      const orderItems: OrderItemOrmEntity[] = [];
      const allSkus: OrderItemSkuOrmEntity[] = [];

      for (let i = 0; i < dto.items.length; i++) {
        const itemDto = dto.items[i];
        
        // สร้าง OrderItem ก่อน (totals จะคำนวณทีหลัง)
        const itemEntity = await this.orderItemRepository.create(
          {
            order,
            productName: itemDto.productName,
            imageId: itemDto.imageId ?? null,
            discountType: itemDto.discountType ?? null,
            discountValue: itemDto.discountValue ?? null,
            quantity: 0, // จะคำนวณจาก SKUs
            purchaseTotal: 0,
            shippingTotal: 0,
            totalCostBeforeDiscount: 0,
            discountAmount: 0,
            finalCost: 0,
            sellingTotal: 0,
            profit: 0,
          } as Partial<OrderItemOrmEntity>,
          manager,
        );

        // สร้าง SKUs สำหรับ OrderItem นี้
        const itemSkus: OrderItemSkuOrmEntity[] = [];
        for (let j = 0; j < itemDto.skus.length; j++) {
          const skuDto = itemDto.skus[j];
          
          // คำนวณค่าสำหรับ SKU ตาม CALCULATION RULES
          const purchaseTotal = skuDto.purchasePrice * skuDto.quantity * buyRateEntity.rate;
          const sellingTotal = skuDto.sellingPriceForeign * skuDto.quantity * sellRateEntity.rate;
          const profit = sellingTotal - purchaseTotal;

          const skuEntity = await this.orderItemSkuRepository.create(
            {
              orderItem: itemEntity,
              orderItemSkuIndex: i,
              variant: skuDto.variant,
              quantity: skuDto.quantity,
              exchangeRateBuy: buyRateEntity,
              exchangeRateSell: sellRateEntity,
              exchangeRateBuyValue: Number(buyRateEntity.rate),
              exchangeRateSellValue: Number(sellRateEntity.rate),
              purchasePrice: skuDto.purchasePrice,
              purchaseTotal: Number(purchaseTotal),
              sellingPriceForeign: skuDto.sellingPriceForeign,
              sellingTotal: Number(sellingTotal),
              profit: Number(profit),
            } as Partial<OrderItemSkuOrmEntity>,
            manager,
          );
          
          itemSkus.push(skuEntity);
          allSkus.push(skuEntity);
        }

        // คำนวณ aggregated totals จาก SKUs ตาม CALCULATION RULES
        let totalQuantity = 0;
        let totalPurchaseCost = 0;
        let totalSellingAmount = 0;
        let totalProfit = 0;

        for (const sku of itemSkus) {
          totalQuantity += sku.quantity;
          totalPurchaseCost += Number(sku.purchaseTotal);
          totalSellingAmount += Number(sku.sellingTotal);
          totalProfit += Number(sku.profit);
        }

        // Shipping at ITEM level
        const shippingPrice = itemDto.shippingPrice ?? 0;
        const totalShippingCost = shippingPrice * totalQuantity * buyRateEntity.rate;
        const totalCostBeforeDiscount = totalPurchaseCost + totalShippingCost;

        // คำนวณส่วนลดระดับ item
        let discountAmount = 0;
        if (itemEntity.discountType && itemEntity.discountValue != null) {
          if (itemEntity.discountType === 'PERCENT') {
            discountAmount = totalCostBeforeDiscount * (itemEntity.discountValue / 100);
          } else {
            discountAmount = itemEntity.discountValue;
          }
        }

        const finalCost = totalCostBeforeDiscount - discountAmount;
        const itemProfit = totalSellingAmount - finalCost;

        // อัพเดต OrderItem ด้วย aggregated values
        await this.orderItemRepository.update(
          itemEntity.id,
          {
            quantity: totalQuantity,
            purchaseTotal: totalPurchaseCost,
            shippingTotal: totalShippingCost,
            totalCostBeforeDiscount: totalCostBeforeDiscount,
            discountAmount: discountAmount,
            finalCost: finalCost,
            sellingTotal: totalSellingAmount,
            profit: itemProfit,
          } as Partial<OrderItemOrmEntity>,
          manager,
        );

        // อัพเดต object ใน memory เพื่อใช้ต่อ
        itemEntity.quantity = totalQuantity;
        itemEntity.purchaseTotal = totalPurchaseCost;
        itemEntity.shippingTotal = totalShippingCost;
        itemEntity.totalCostBeforeDiscount = totalCostBeforeDiscount;
        itemEntity.discountAmount = discountAmount;
        itemEntity.finalCost = finalCost;
        itemEntity.sellingTotal = totalSellingAmount;
        itemEntity.profit = itemProfit;

        orderItems.push(itemEntity);
      }

      // ตรวจสอบ stock: รวม qty ที่ customer orders ขอต่อ order item SKU
      const requestedBySku: Map<string, number> = new Map();
      
      for (const co of dto.customerOrders) {
        for (const coItem of co.items) {
          const itemIndex = coItem.orderItemIndex;
          const skuIndex = coItem.skuIndex;
          
          if (itemIndex < 0 || itemIndex >= orderItems.length) {
            throw new BadRequestException(`Invalid orderItemIndex ${itemIndex}`);
          }
          
          const itemDto = dto.items[itemIndex];
          if (skuIndex < 0 || skuIndex >= itemDto.skus.length) {
            throw new BadRequestException(`Invalid skuIndex ${skuIndex} for orderItem ${itemIndex}`);
          }
          
          const key = `${itemIndex}-${skuIndex}`;
          const currentRequested = requestedBySku.get(key) || 0;
          requestedBySku.set(key, currentRequested + coItem.quantity);
        }
      }

      // ตรวจสอบว่า quantity ที่ขอไม่เกินว่าที่มี
      for (const co of dto.customerOrders) {
        for (const coItem of co.items) {
          const itemIndex = coItem.orderItemIndex;
          const skuIndex = coItem.skuIndex;
          const key = `${itemIndex}-${skuIndex}`;
          const requested = requestedBySku.get(key) || 0;
          const available = dto.items[itemIndex].skus[skuIndex].quantity;
          
          if (requested > available) {
            throw new BadRequestException(
              `Insufficient stock for item "${dto.items[itemIndex].productName}" variant "${dto.items[itemIndex].skus[skuIndex].variant}": requested ${requested}, available ${available}`
            );
          }
        }
      }

      // 4) สร้าง Customer Orders และ Customer Order Items
      const customerOrders: CustomerOrderOrmEntity[] = [];

      for (const coDto of dto.customerOrders) {
        const customer = await this.customerRepository.findOneById(coDto.customerId, manager);
        if (!customer) throw new NotFoundException(`Customer not found: ${coDto.customerId}`);

        let totalSellingAmount = 0;
        const coItemsToCreate: {
          orderItemSku: OrderItemSkuOrmEntity;
          quantity: number;
          sellingPriceForeign: number;
        }[] = [];

        for (const coItemDto of coDto.items) {
          const orderItem = orderItems[coItemDto.orderItemIndex];
          const skuIndex = coItemDto.skuIndex;
          
          // Find the corresponding SKU from our created SKUs
          const orderItemSkus = allSkus.filter(sku => sku.orderItem.id === orderItem.id);
          const orderItemSku = orderItemSkus[skuIndex];
          
          if (!orderItemSku) {
            throw new BadRequestException(`SKU not found for orderItem ${coItemDto.orderItemIndex}, skuIndex ${skuIndex}`);
          }
          
          const sellingPrice = coItemDto.sellingPriceForeign ?? Number(orderItemSku.sellingPriceForeign);
          const lineTotal = coItemDto.quantity * sellingPrice;
          totalSellingAmount += lineTotal;
          coItemsToCreate.push({
            orderItemSku,
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
          const sellingPrice = coItem.sellingPriceForeign;
          const exchangeRateSellValue = coItem.orderItemSku.exchangeRateSellValue || sellRateEntity.rate;
          const sellingTotal = coItem.quantity * sellingPrice * exchangeRateSellValue;
          
          // Cost allocation based on SKU's purchase cost per unit
          const costPerUnit = Number(coItem.orderItemSku.purchaseTotal) / coItem.orderItemSku.quantity;
          const costAllocated = costPerUnit * coItem.quantity;
          
          // Profit calculation for customer order item
          const profit = sellingTotal - costAllocated;

          await this.customerOrderItemRepository.create(
            {
              customerOrder,
              orderItemSku: coItem.orderItemSku,
              quantity: coItem.quantity,
              sellingPriceForeign: coItem.sellingPriceForeign,
              sellingTotal: Number(sellingTotal),
              profit: Number(profit),
            } as Partial<CustomerOrderItemOrmEntity>,
            manager,
          );
        }
      }

      // 5) คำนวณ order-level totals โดย sum จาก items
      let totalPurchaseCost = 0;
      let totalShippingCost = 0;
      let totalCostBeforeDiscount = 0;
      let totalDiscount = 0;
      let totalFinalCost = 0;
      let totalSellingAmount = 0;
      let totalProfit = 0;

      for (const oi of orderItems) {
        totalPurchaseCost += Number(oi.purchaseTotal);
        totalShippingCost += Number(oi.shippingTotal);
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
          'orderItems.skus',
          'customerOrders',
          'customerOrders.customerOrderItems',
          'customerOrders.customerOrderItems.orderItemSku',
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
