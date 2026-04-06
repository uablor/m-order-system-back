declare const NOTIFICATION_TYPES: readonly ["ARRIVAL", "PAYMENT", "REMINDER"];
declare const STATUSES: readonly ["SENT", "FAILED"];
export declare class NotificationListQueryDto {
    page?: number;
    limit?: number;
    merchantId?: number;
    customerId?: number;
    notificationType?: (typeof NOTIFICATION_TYPES)[number];
    status?: (typeof STATUSES)[number];
    search?: string;
    startDate?: string;
    endDate?: string;
}
export {};
