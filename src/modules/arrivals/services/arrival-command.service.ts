import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { ArrivalRepository } from '../repositories/arrival.repository';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { OrderRepository } from '../../orders/repositories/order.repository';
import { OrderItemRepository } from '../../orders/repositories/order-item.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { NotificationSendService } from '../../notifications/services/notification-send.service';
import { CreateArrivalDto } from '../dto/create-arrival.dto';
import { ArrivalUpdateDto } from '../dto/arrival-update.dto';
import { ArrivalOrmEntity } from '../entities/arrival.orm-entity';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';
import { OrderItemOrmEntity } from '../../orders/entities/order-item.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { formatTime } from 'src/common/utils/dayjs.util';

@Injectable()
export class ArrivalCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly arrivalRepository: ArrivalRepository,
    private readonly arrivalItemRepository: ArrivalItemRepository,
    private readonly orderRepository: OrderRepository,
    private readonly orderItemRepository: OrderItemRepository,
    private readonly merchantRepository: MerchantRepository,
    private readonly notificationSendService: NotificationSendService,
  ) {}

  async create(
    dto: CreateArrivalDto,
    currentUser: CurrentUserPayload,
  ): Promise<{
    success: true;
    arrival: object;
    notifications: object[];
    message: string;
  }> {
    return this.transactionService.run(async (manager) => {
      const order = await this.orderRepository.getRepo(manager).findOne({
        where: { id: dto.orderId },
        relations: [
          'merchant',
          'customerOrders',
          'customerOrders.customer',
          'orderItems',
        ],
      });
      if (!order) throw new NotFoundException('Order not found');

      const merchant = await this.merchantRepository.findOneById(
        currentUser.merchantId!,
        manager,
      );
      if (!merchant) throw new NotFoundException('Merchant not found');
      if (order.merchant?.id !== merchant.id) {
        throw new BadRequestException('Order does not belong to this merchant');
      }

      const arrivedDate = new Date();
      const arrivedTime = formatTime(arrivedDate);
      const recordedBy = currentUser.userId;

      // Validate arrived_quantity <= order_item.quantity and resolve order items
      const orderItemMap = new Map<number, OrderItemOrmEntity>();
      for (const oi of order.orderItems ?? []) {
        orderItemMap.set(oi.id, oi);
      }
      for (const item of dto.arrivalItems) {
        const orderItem = orderItemMap.get(item.orderItemId);
        if (!orderItem) {
          throw new BadRequestException(
            `Order item ${item.orderItemId} not found in this order`,
          );
        }
        if (item.arrivedQuantity > orderItem.quantity) {
          throw new BadRequestException(
            `Arrived quantity (${item.arrivedQuantity}) exceeds order item quantity (${orderItem.quantity}) for product "${orderItem.productName}"`,
          );
        }
      }

      // 1) Create arrival
      const arrival = await this.arrivalRepository.create(
        {
          order,
          merchant,
          arrivedDate,
          arrivedTime: arrivedTime,
          recordedByUser:
            recordedBy != null ? ({ id: recordedBy } as any) : null,
          notes: dto.notes ?? null,
        } as Partial<ArrivalOrmEntity>,
        manager,
      );

      // 2) Create arrival_items and update order_items.quantity_remaining
      const arrivalItems: ArrivalItemOrmEntity[] = [];
      const damagedOrLost: string[] = [];

      for (const itemDto of dto.arrivalItems) {
        const orderItem = orderItemMap.get(itemDto.orderItemId)!;
        const condition = itemDto.condition ?? 'OK';
        if (condition === 'DAMAGED')
          damagedOrLost.push(`${orderItem.productName}: DAMAGED`);
        if (condition === 'LOST')
          damagedOrLost.push(`${orderItem.productName}: LOST`);

        const arrivalItem = await this.arrivalItemRepository.create(
          {
            arrival,
            orderItem,
            arrivedQuantity: itemDto.arrivedQuantity,
            condition: condition as 'OK' | 'DAMAGED' | 'LOST',
            notes: itemDto.notes ?? null,
          } as Partial<ArrivalItemOrmEntity>,
          manager,
        );
        arrivalItems.push(arrivalItem);

        const newRemaining =
          orderItem.quantityRemaining + itemDto.arrivedQuantity;
        await this.orderItemRepository.update(
          orderItem.id,
          { quantityRemaining: newRemaining } as Partial<OrderItemOrmEntity>,
          manager,
        );
      }

      // 3) Build message and get distinct customers
      const arrivedDateStr = arrivedDate.toISOString().slice(0, 10);
      let messageContent = `Your order ${order.orderCode} has arrived on ${arrivedDateStr}.`;
      if (damagedOrLost.length > 0) {
        messageContent += ` Note: ${damagedOrLost.join('; ')}.`;
      }
      const notificationLinkPath = `/orders/${order.id}`;

      const customerOrders = order.customerOrders ?? [];
      const seenCustomerIds = new Set<number>();
      const customers: Array<{
        id: number;
        contactFacebook?: string | null;
        contactLine?: string | null;
        contactWhatsapp?: string | null;
        preferredContactMethod?: 'PHONE' | 'FACEBOOK' | 'WHATSAPP' | 'LINE' | null;
      }> = [];
      for (const co of customerOrders) {
        const customer = co.customer;
        if (!customer || seenCustomerIds.has(customer.id)) continue;
        seenCustomerIds.add(customer.id);
        customers.push({
          id: customer.id,
          contactFacebook: customer.contactFacebook,
          contactLine: customer.contactLine,
          contactWhatsapp: customer.contactWhatsapp,
          preferredContactMethod: customer.preferredContactMethod,
        });
      }

      // 4) Create and send notifications via notification module
      const notifications =
        await this.notificationSendService.sendArrivalNotifications(manager, {
          merchant,
          orderId: order.id,
          customers,
          messageContent,
          notificationLinkPath,
        });

      // 5) Update order arrival_status and arrived_at, notified_at
      await this.orderRepository.update(
        order.id,
        {
          arrivalStatus: 'ARRIVED',
          arrivedAt: arrivedDate,
          notifiedAt: notifications.some((n) => n.status === 'SENT')
            ? new Date()
            : null,
        } as Partial<
          import('../../orders/entities/order.orm-entity').OrderOrmEntity
        >,
        manager,
      );

      const arrivalReloaded = await this.arrivalRepository
        .getRepo(manager)
        .findOne({
          where: { id: arrival.id },
          relations: [
            'arrivalItems',
            'arrivalItems.orderItem',
            'order',
            'merchant',
          ],
        });

      return {
        success: true,
        arrival: arrivalReloaded ?? { ...arrival, arrivalItems },
        notifications: notifications.map((n) => ({
          id: n.id,
          customerId: n.customer?.id,
          channel: n.channel,
          status: n.status,
          sentAt: n.sentAt,
          errorMessage: n.errorMessage,
        })),
        message: 'Arrival recorded and notifications sent successfully',
      };
    });
  }

  async update(id: number, dto: ArrivalUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.arrivalRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Arrival not found');
      const updateData: Partial<ArrivalOrmEntity> = {};
      if (dto.arrivedDate !== undefined)
        updateData.arrivedDate = new Date(dto.arrivedDate);
      if (dto.arrivedTime !== undefined)
        updateData.arrivedTime = dto.arrivedTime;
      if (dto.recordedBy !== undefined)
        updateData.recordedByUser =
          dto.recordedBy != null ? ({ id: dto.recordedBy } as any) : null;
      if (dto.notes !== undefined) updateData.notes = dto.notes ?? null;
      await this.arrivalRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.arrivalRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Arrival not found');
      await this.arrivalRepository.delete(id, manager);
    });
  }
}
