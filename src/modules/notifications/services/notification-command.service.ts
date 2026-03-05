import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationUpdateDto } from '../dto/notification-update.dto';
import { NotificationStatusUpdateDto } from '../dto/notification-status-update.dto';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { generateUniqueToken } from 'src/common/utils/generate-unique-token.utils';
import { ConfigService } from '@nestjs/config';
import { CustomerQueryRepository } from 'src/modules/customers/repositories/customer.query-repository';
import { CreateNotificationDto, CreateNotificationMultipleDto } from '../dto/create-notification.dto';
import { NotificationChannel, NotificationStatus, NotificationType } from '../enum/notification.enum';
import { CustomerOrderQueryRepository } from 'src/modules/orders/repositories/customer-order.query-repository';
import { CustomerOrderOrmEntity } from 'src/modules/orders/entities/customer-order.orm-entity';
import { EntityManager, In } from 'typeorm';
import { MerchantQueryRepository } from 'src/modules/merchants/repositories/merchant.query-repository';
import { NotificationQueryRepository } from '../repositories/notification.query-repository';

@Injectable()
export class NotificationCommandService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationQueryRepository: NotificationQueryRepository,
    private readonly configService: ConfigService,
    private readonly customerQueryRepository: CustomerQueryRepository,
  ) { }

  async update(id: number, dto: NotificationUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.notificationRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Notification not found');
      const updateData: Partial<NotificationOrmEntity> = {};
      if (dto.status !== undefined) updateData.status = dto.status;
      if (dto.retryCount !== undefined) updateData.retryCount = dto.retryCount;
      if (dto.lastRetryAt !== undefined)
        updateData.lastRetryAt = dto.lastRetryAt ? new Date(dto.lastRetryAt) : null;
      if (dto.sentAt !== undefined) updateData.sentAt = dto.sentAt ? new Date(dto.sentAt) : null;
      if (dto.errorMessage !== undefined) updateData.errorMessage = dto.errorMessage ?? null;
      await this.notificationRepository.update(id, updateData, manager);
    });
  }

  async updateStatusSent(id: number, dto: NotificationStatusUpdateDto): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.notificationRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Notification not found');

      const updateData: Partial<NotificationOrmEntity> = {};
      if (dto.status !== undefined) {
        updateData.status = dto.status;
        // Auto-update sentAt when status is set to SENT
        if (dto.status === NotificationStatus.SENT && !existing.sentAt) {
          updateData.sentAt = new Date();
        }
      }
      await this.notificationRepository.update(id, updateData, manager);
    });
  }

  async delete(id: number): Promise<void> {
    await this.transactionService.run(async (manager) => {
      const existing = await this.notificationRepository.findOneById(id, manager);
      if (!existing) throw new NotFoundException('Notification not found');
      await this.notificationRepository.delete(id, manager);
    });
  }

  async create(
    dto: CreateNotificationDto,
    currentUser: CurrentUserPayload,
    manager?: EntityManager,
  ): Promise<NotificationOrmEntity> {

    if (manager) {
      const { notification } = await this.createInternalWithCustomer(dto, currentUser, manager);
      return notification;
    }

    return this.transactionService.run(async (manager) => {
      const { notification } = await this.createInternalWithCustomer(dto, currentUser, manager);
      return notification;
    });
  }

  async createMultiple(
    dto: CreateNotificationMultipleDto,
    currentUser: CurrentUserPayload,
  ): Promise<Array<{ recipientContact: string; notificationLink: string | null; language: string | null; customer?: { customerName?: string } | null; relatedOrders: number[] | null }>> {

    return this.transactionService.run(async (manager) => {

      const results: Array<{ recipientContact: string; notificationLink: string | null; language: string | null; customer?: { customerName?: string } | null; relatedOrders: number[] | null }> = [];

      const language = dto.language ?? 'en';

      for (const notificationData of dto.notifications) {
        const { notification, customer } = await this.createInternalWithCustomer(
          { ...notificationData, language } as CreateNotificationDto,
          currentUser,
          manager,
        );

        results.push({
          recipientContact: notification.recipientContact,
          notificationLink: notification.notificationLink,
          language: notification.language ?? language,
          customer: customer ? { customerName: customer.customerName } : null,
          relatedOrders: notification.relatedOrders,
        });
      }

      return results;

    });

  }

  /** createInternal ที่ return notification และ customer สำหรับใช้ใน createMultiple response */
  private async createInternalWithCustomer(
    dto: CreateNotificationDto,
    currentUser: CurrentUserPayload,
    manager: EntityManager,
  ): Promise<{ notification: NotificationOrmEntity; customer: { id: number; customerName: string } }> {

    const notificationsToken = generateUniqueToken();

    const customer = await this.customerQueryRepository.findOneByIdWithMerchant(
      dto.customerId,
      currentUser,
      manager,
    );

    if (!customer) throw new NotFoundException('Customer not found');

    const customerOrders = await manager.getRepository(CustomerOrderOrmEntity).find({
      where: {
        id: In(dto.customerOrderIds),
        order: {
          merchant: {
            id: currentUser.merchantId!,
          },
        },
      },
      relations: ['order'],
      select: {
        id: true,
        order: { id: true },
      },
    });

    if (customerOrders.length !== dto.customerOrderIds.length) {
      throw new NotFoundException('Some orders not found');
    }

    const notificationQuery = await this.notificationQueryRepository.findCustomerOrderBy(dto.customerOrderIds, manager);
    if (notificationQuery.length > 0) {
      throw new BadRequestException('Some orders already have notifications');
    }

    const baseUrl = (this.configService.get<string>('FRONTEND_URL') || '').replace(/\/$/, '');

    const notificationLink =
      `${baseUrl}/customer/item-arrived?customerToken=${customer.uniqueToken}&notificationToken=${notificationsToken}`;

    const notification = await this.notificationRepository.create({
      customer: { id: customer.id } as any,
      merchant: { id: currentUser.merchantId } as any,
      messageContent: dto.message || 'Your order has been updated',
      notificationLink,
      uniqueToken: notificationsToken,
      channel: NotificationChannel.FB,
      notificationType: NotificationType.ARRIVAL,
      recipientContact: customer.contactWhatsapp || customer.contactPhone || '',
      status: NotificationStatus.PENDING,
      sentAt: new Date(),
      retryCount: 0,
      relatedOrders: customerOrders.map((co) => co.id),
      language: dto.language ?? 'en',
    }, manager);

    const coRepo = manager.getRepository(CustomerOrderOrmEntity);

    await coRepo.update(
      { id: In(customerOrders.map((c) => c.id)) },
      { notification: notification },
    );

    return { notification, customer: { id: customer.id, customerName: customer.customerName } };
  }
}
