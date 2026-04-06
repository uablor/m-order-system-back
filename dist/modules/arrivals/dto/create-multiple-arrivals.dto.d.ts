import { CreateNotificationDto } from 'src/modules/notifications/dto/create-notification.dto';
export declare class CreateArrivalItemDto {
    orderItemId: number;
    arrivedQuantity: number;
    condition?: 'OK' | 'DAMAGED' | 'LOST';
    notes?: string;
}
export declare class CreateArrivalDto {
    orderId: number;
    notes?: string;
    arrivalItems: CreateArrivalItemDto[];
}
export declare class CreateMultipleArrivalsDto {
    notes?: string;
    orders: CreateArrivalDto[];
    notification?: boolean;
    language?: 'en' | 'th' | 'la';
    notis?: CreateNotificationDto[];
}
