import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EntityManager } from 'typeorm';
import { NotificationRepository } from '../repositories/notification.repository';
import { FacebookMessengerService } from './facebook-messenger.service';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';
import type { PreferredContactMethod } from '../../customers/entities/customer.orm-entity';
import type { MerchantOrmEntity } from '../../merchants/entities/merchant.orm-entity';

type NotificationChannel = 'FB' | 'LINE' | 'WHATSAPP';
function preferredToChannel(
  pref: PreferredContactMethod | null,
): NotificationChannel | null {
  if (!pref) return null;
  if (pref === 'FACEBOOK') return 'FB';
  if (pref === 'LINE') return 'LINE';
  if (pref === 'WHATSAPP') return 'WHATSAPP';
  return null;
}

function getRecipientContact(
  customer: {
    contactFacebook?: string | null;
    contactLine?: string | null;
    contactWhatsapp?: string | null;
    preferredContactMethod?: PreferredContactMethod | null;
  },
  channel: NotificationChannel,
): string {
  switch (channel) {
    case 'FB':
      return customer.contactFacebook ?? '';
    case 'LINE':
      return customer.contactLine ?? '';
    case 'WHATSAPP':
      return customer.contactWhatsapp ?? '';
    default:
      return '';
  }
}

function buildFullUrl(baseUrl: string, path: string): string {
  const base = (baseUrl ?? '').replace(/\/$/, '');
  const p = (path ?? '').replace(/^\//, '');
  return p ? `${base}/${p}` : base || '';
}

export interface SendArrivalNotificationsParams {
  merchant: MerchantOrmEntity;
  orderId: number;
  customers: Array<{
    id: number;
    contactFacebook?: string | null;
    contactLine?: string | null;
    contactWhatsapp?: string | null;
    preferredContactMethod?: PreferredContactMethod | null;
    token: string;
  }>;
  messageContent: string;
  notificationLinkPath: string;
}

@Injectable()
export class NotificationSendService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly facebookMessengerService: FacebookMessengerService,
    private readonly configService: ConfigService,
  ) { }

  async sendArrivalNotifications(
    manager: EntityManager,
    params: SendArrivalNotificationsParams,
  ): Promise<NotificationOrmEntity[]> {
    const { merchant, orderId, customers, messageContent, notificationLinkPath } = params;

    const notifications: NotificationOrmEntity[] = [];

    for (const customer of customers) {
      const frontendUrl =
        this.configService.get<string>('FRONTEND_URL', { infer: true }) ??
        `${this.configService.get<string>('FRONTEND_URL', { infer: true })?.replace(/\/$/, '')}/?token=${customer.token}`;
      const fullNotificationLink = buildFullUrl(frontendUrl, notificationLinkPath);

      const channel = preferredToChannel(customer.preferredContactMethod ?? null);
      const recipientContact = channel
        ? getRecipientContact(customer, channel)
        : '';

      let status: 'SENT' | 'FAILED' = 'SENT';
      let errorMessage: string | null = null;
      let sentAt: Date | null = new Date();

      if (!channel || !recipientContact) {
        status = 'FAILED';
        errorMessage = 'No contact channel or recipient contact available';
        sentAt = null;
      } else if (channel === 'FB') {
        const messageWithLink = `${messageContent} ดูรายละเอียด: ${fullNotificationLink}`;
        const sendResult =
          await this.facebookMessengerService.sendMessage(
            recipientContact,
            messageWithLink,
          );
        if (!sendResult.success) {
          status = 'FAILED';
          errorMessage = sendResult.errorMessage ?? 'Failed to send';
          sentAt = null;
        }
      }

      try {
        const notification = await this.notificationRepository.create(
          {
            merchant,
            customer: { id: customer.id } as any,
            notificationType: 'ARRIVAL',
            channel: channel ?? 'FB',
            recipientContact: recipientContact || 'N/A',
            messageContent,
            notificationLink: fullNotificationLink,
            retryCount: 0,
            lastRetryAt: null,
            status,
            sentAt,
            errorMessage,
            relatedOrders: [orderId],
          } as Partial<NotificationOrmEntity>,
          manager,
        );
        notifications.push(notification);
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error';
        const failedNotification = await this.notificationRepository.create(
          {
            merchant,
            customer: { id: customer.id } as any,
            notificationType: 'ARRIVAL',
            channel: channel ?? 'FB',
            recipientContact: recipientContact || 'N/A',
            messageContent,
            notificationLink: fullNotificationLink,
            retryCount: 0,
            lastRetryAt: null,
            status: 'FAILED',
            sentAt: null,
            errorMessage: errMsg,
            relatedOrders: [orderId],
          } as Partial<NotificationOrmEntity>,
          manager,
        );
        notifications.push(failedNotification);
      }
    }

    return notifications;
  }
}
