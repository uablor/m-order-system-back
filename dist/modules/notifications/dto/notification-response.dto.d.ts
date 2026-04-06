import { CustomerResponseDto } from 'src/modules/customers/dto/customer-response.dto';
import { MerchantResponseDto } from 'src/modules/merchants/dto/merchant-response.dto';
export declare class NotificationResponseDto {
    id: number;
    merchant: MerchantResponseDto;
    customer: CustomerResponseDto;
    notificationType: string;
    channel: string;
    recipientContact: string;
    messageContent: string;
    notificationLink: string | null;
    retryCount: number;
    lastRetryAt: Date | null;
    status: string;
    statusSent?: string;
    sentAt: Date | null;
    errorMessage: string | null;
    relatedOrders: number[] | null;
    createdAt: Date;
    updatedAt: Date;
}
