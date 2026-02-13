import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationQueryRepository } from '../repositories/notification.query-repository';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationListQueryDto } from '../dto/notification-list-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';

@Injectable()
export class NotificationQueryService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationQueryRepository: NotificationQueryRepository,
  ) {}

  async getById(id: number): Promise<NotificationResponseDto | null> {
    const entity = await this.notificationQueryRepository.repository.findOne({
      where: { id },
      relations: ['merchant', 'customer'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<NotificationResponseDto> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Notification not found');
    return dto;
  }

  async getList(query: NotificationListQueryDto): Promise<PaginatedResult<NotificationResponseDto>> {
    const result = await this.notificationQueryRepository.findWithPagination({
      page: query.page,
      limit: query.limit,
      merchantId: query.merchantId,
      customerId: query.customerId,
      notificationType: query.notificationType,
      status: query.status,
    });
    return {
      results: result.results.map((e) => this.toResponse(e)),
      pagination: result.pagination,
    };
  }

  private toResponse(entity: NotificationOrmEntity): NotificationResponseDto {
    return {
      id: entity.id,
      merchantId: entity.merchant?.id ?? 0,
      customerId: entity.customer?.id ?? 0,
      notificationType: entity.notificationType,
      channel: entity.channel,
      recipientContact: entity.recipientContact,
      messageContent: entity.messageContent,
      notificationLink: entity.notificationLink ?? null,
      retryCount: entity.retryCount,
      lastRetryAt: entity.lastRetryAt ?? null,
      status: entity.status,
      sentAt: entity.sentAt ?? null,
      errorMessage: entity.errorMessage ?? null,
      relatedOrders: entity.relatedOrders ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
