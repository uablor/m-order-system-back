import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationQueryRepository } from '../repositories/notification.query-repository';
import { NotificationListQueryDto } from '../dto/notification-list-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import { createPaginatedResponse, createSingleResponse } from '../../../common/base/helpers/response.helper';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { MerchantResponseDto } from 'src/modules/merchants/dto/merchant-response.dto';

@Injectable()
export class NotificationQueryService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly notificationQueryRepository: NotificationQueryRepository,
  ) { }

  async getById(id: number): Promise<NotificationResponseDto | null> {
    const entity = await this.notificationQueryRepository.repository.findOne({
      where: { id },
      relations: ['merchant', 'customer'],
    });
    if (!entity) return null;
    return this.toResponse(entity);
  }

  async getByIdOrFail(id: number): Promise<ResponseInterface<NotificationResponseDto>> {
    const dto = await this.getById(id);
    if (!dto) throw new NotFoundException('Notification not found');
    return createSingleResponse(dto);
  }

  async getList(query: NotificationListQueryDto, user?: CurrentUserPayload): Promise<ResponseWithPaginationInterface<NotificationResponseDto>> {
    const paginationOptions: NotificationListQueryDto = {
      page: query.page,
      limit: query.limit,
      customerId: query.customerId,
      notificationType: query.notificationType,
      status: query.status,
      search: query.search,
      startDate: query.startDate,
      endDate: query.endDate,
    }
    if (user?.merchantId) {
      paginationOptions.merchantId = user.merchantId;
    } else {
      paginationOptions.merchantId = query.merchantId;
    }
    const result = await this.notificationQueryRepository.findWithPagination(paginationOptions);
    return createPaginatedResponse(
      result.results.map((e) => this.toResponse(e)),
      result.pagination,
    );
  }

  private toResponse(entity: NotificationOrmEntity): NotificationResponseDto {
    return {
      id: entity.id,
      merchant:{
        id: entity.merchant?.id ?? 0,
        ownerUserId: entity.merchant?.ownerUserId ?? 0,
        shopName: entity.merchant?.shopName,
        shopLogoUrl: entity.merchant?.shopLogoUrl,
        shopAddress: entity.merchant?.shopAddress,
        contactPhone: entity.merchant?.contactPhone,
        contactEmail: entity.merchant?.contactEmail,
        contactFacebook: entity.merchant?.contactFacebook,
        contactLine: entity.merchant?.contactLine,
        contactWhatsapp: entity.merchant?.contactWhatsapp,
        defaultCurrency: entity.merchant?.defaultCurrency,
        isActive: entity.merchant?.isActive ?? false,
        createdAt: entity.merchant?.createdAt ,
        updatedAt: entity.merchant?.updatedAt ,
      },
      customer: {
        id: entity.customer?.id ?? 0,
        merchantId: entity.customer?.merchant?.id ?? 0,
        customerName: entity.customer?.customerName,
        customerType: entity.customer?.customerType,
        contactPhone: entity.customer?.contactPhone,
        shippingAddress: entity.customer?.shippingAddress,
        shippingProvider: entity.customer?.shippingProvider,
        shippingSource: entity.customer?.shippingSource,
        shippingDestination: entity.customer?.shippingDestination,
        paymentTerms: entity.customer?.paymentTerms,
        contactFacebook: entity.customer?.contactFacebook,
        contactWhatsapp: entity.customer?.contactWhatsapp,
        contactLine: entity.customer?.contactLine,
        preferredContactMethod: entity.customer?.preferredContactMethod,
        uniqueToken: entity.customer?.uniqueToken,
        isActive: entity.customer?.isActive,
        createdAt: entity.customer?.createdAt,
        updatedAt: entity.customer?.updatedAt,
      },
      notificationType: entity.notificationType,
      channel: entity.channel,
      recipientContact: entity.recipientContact,
      messageContent: entity.messageContent,
      notificationLink: entity.notificationLink ?? null,
      retryCount: entity.retryCount,
      lastRetryAt: entity.lastRetryAt ?? null,
      status: entity.status,
      statusSent: entity.statusSent,
      sentAt: entity.sentAt ?? null,
      errorMessage: entity.errorMessage ?? null,
      relatedOrders: entity.relatedOrders ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
