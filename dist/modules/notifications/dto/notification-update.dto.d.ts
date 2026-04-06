import { NotificationStatus } from '../enum/notification.enum';
export declare class NotificationUpdateDto {
    status?: NotificationStatus;
    retryCount?: number;
    lastRetryAt?: string | null;
    sentAt?: string | null;
    errorMessage?: string | null;
}
