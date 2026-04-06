export declare class CreateNotificationDto {
    customerOrderIds: number[];
    message?: string;
    customerId: number;
    language?: 'en' | 'th' | 'la';
}
export declare class CreateNotificationMultipleDto {
    notifications: CreateNotificationDto[];
    language?: 'en' | 'th' | 'la';
}
