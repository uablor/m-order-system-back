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
import { ArrivalStatusEnum } from '../enum/enum.entities';

const ZERO = '0';

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
        throw new BadRequestException('ยังไม่มี BUY exchange rate สำหรับวันนี้ กรุณาตั้งค่าอัตราแลกเปลี่ยนก่อน');
      }
      if (!sellRateEntity) {
        throw new BadRequestException('ยังไม่มี SELL exchange rate สำหรับวันนี้ กรุณาตั้งค่าอัตราแลกเปลี่ยนก่อน');
      }
      const buyRate = Number(buyRateEntity.rate);
      const sellRate = Number(sellRateEntity.rate);
      const purchaseCurrency = buyRateEntity.baseCurrency;

      // 1) สร้าง Order header (totals จะ update ทีหลัง)
      const order = await this.orderRepository.create(
        {
          merchant,
          createdByUser: currentUser ? { id: currentUser.userId } : null,
          orderCode: dto.orderCode,
          orderDate,
          arrivalStatus: ArrivalStatusEnum.NOT_ARRIVED,
          totalPurchaseCostLak: ZERO,
          totalShippingCostLak: ZERO,
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

      // 2) สร้าง Order Items ด้วย exchange rate จาก DB
      const orderItems: OrderItemOrmEntity[] = [];
      for (let i = 0; i < dto.items.length; i++) {
        const it = dto.items[i];
        const shippingPriceInput = it.shippingPrice ?? 0;

        // step 1: total_buy_lak = buy_price × quantity × buy_exchange_rate
        const totalBuyLak = it.purchasePrice * it.quantity * buyRate;

        // step 2: shipping_lak = shipping_price × buy_exchange_rate
        const shippingLak = shippingPriceInput * buyRate;

        // step 3: subtotal_lak = total_buy_lak + shipping_lak
        const subtotalLak = totalBuyLak + shippingLak;

        // step 4: discount
        let discountLak = 0;
        if (it.discountType && it.discountValue != null) {
          if (it.discountType === 'percent') {
            // discount_lak = subtotal_lak × (discount_value / 100)
            discountLak = subtotalLak * (it.discountValue / 100);
          } else {
            // cash: discount_lak = discount_value × buy_exchange_rate
            discountLak = it.discountValue * buyRate;
          }
        }

        // step 5: final_buy_lak = subtotal_lak - discount_lak
        const finalCostLak = subtotalLak - discountLak;

        // step 6: final_buy_thb = final_buy_lak / buy_exchange_rate
        const finalCostThb = buyRate > 0 ? finalCostLak / buyRate : 0;

        // step 7: sell_price_lak = sell_price × quantity × sell_exchange_rate
        const sellPriceLak = it.sellingPriceForeign * it.quantity * sellRate;

        // step 8: profit_lak = sell_price_lak - final_buy_lak
        const profitLak = sellPriceLak - finalCostLak;

        // step 9: profit_thb = profit_lak / sell_exchange_rate
        const profitThb = sellRate > 0 ? profitLak / sellRate : 0;

        // map discountType: 'percent' → 'PERCENT', 'cash' → 'FIX'
        const entityDiscountType = it.discountType === 'percent' ? 'PERCENT' : it.discountType === 'cash' ? 'FIX' : null;

        const itemEntity = await this.orderItemRepository.create(
          {
            order,
            orderItemIndex: i,
            productName: it.productName,
            variant: it.variant ?? null,
            quantity: it.quantity,
            quantityRemaining: it.quantity,
            purchaseCurrency: purchaseCurrency,
            purchasePrice: toDecimal(it.purchasePrice),
            purchaseExchangeRate: toDecimal(buyRate),
            purchaseTotalLak: toDecimal2(totalBuyLak),
            shippingPrice: toDecimal(shippingPriceInput),
            shippingLak: toDecimal2(shippingLak),
            totalCostBeforeDiscountLak: toDecimal2(subtotalLak),
            discountType: entityDiscountType,
            discountValue: it.discountValue != null ? toDecimal(it.discountValue) : null,
            discountAmountLak: toDecimal2(discountLak),
            finalCostLak: toDecimal2(finalCostLak),
            finalCostThb: toDecimal2(finalCostThb),
            sellingPriceForeign: toDecimal(it.sellingPriceForeign),
            sellingExchangeRate: toDecimal(sellRate),
            sellingTotalLak: toDecimal2(sellPriceLak),
            profitLak: toDecimal2(profitLak),
            profitThb: toDecimal2(profitThb),
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

        let totalSellingAmountLak = 0;
        const coItemsToCreate: {
          orderItem: OrderItemOrmEntity;
          quantity: number;
          sellingPriceForeign: number;
          sellRate: number;
        }[] = [];

        for (const coItemDto of coDto.items) {
          const orderItem = orderItems[coItemDto.orderItemIndex];
          const sellRate = Number(orderItem.sellingExchangeRate);
          const sellingPrice = coItemDto.sellingPriceForeign ?? Number(orderItem.sellingPriceForeign);
          const lineTotalLak = coItemDto.quantity * sellingPrice * sellRate;
          totalSellingAmountLak += lineTotalLak;
          coItemsToCreate.push({
            orderItem,
            quantity: coItemDto.quantity,
            sellingPriceForeign: sellingPrice,
            sellRate,
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
          const sellingTotalLak = coItem.quantity * coItem.sellingPriceForeign * coItem.sellRate;
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

          // ลด stock
          const newRemaining = coItem.orderItem.quantityRemaining - coItem.quantity;
          await this.orderItemRepository.update(
            coItem.orderItem.id,
            { quantityRemaining: newRemaining } as Partial<OrderItemOrmEntity>,
            manager,
          );
          coItem.orderItem.quantityRemaining = newRemaining;
        }
      }

      // 5) คำนวณ order-level totals โดย sum จาก items (ไม่ต้อง DB rate lookup)
      let totalPurchaseCostLak = 0;
      let totalShippingCostLak = 0;
      let totalCostBeforeDiscountLak = 0;
      let totalDiscountLak = 0;
      let totalFinalCostLak = 0;
      let totalFinalCostThb = 0;
      let totalSellingAmountLak = 0;
      let totalSellingAmountThb = 0;
      let totalProfitLak = 0;
      let totalProfitThb = 0;

      for (const oi of orderItems) {
        totalPurchaseCostLak += Number(oi.purchaseTotalLak);
        totalShippingCostLak += Number(oi.shippingLak);
        totalCostBeforeDiscountLak += Number(oi.totalCostBeforeDiscountLak);
        totalDiscountLak += Number(oi.discountAmountLak);
        totalFinalCostLak += Number(oi.finalCostLak);
        totalFinalCostThb += Number(oi.finalCostThb);
        totalSellingAmountLak += Number(oi.sellingTotalLak);
        const sellRate = Number(oi.sellingExchangeRate);
        totalSellingAmountThb += sellRate > 0 ? Number(oi.sellingTotalLak) / sellRate : 0;
        totalProfitLak += Number(oi.profitLak);
        totalProfitThb += Number(oi.profitThb);
      }

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
          totalShippingCostLak: toDecimal2(totalShippingCostLak),
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
