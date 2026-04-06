import { NotificationCommandService } from '../services/notification-command.service';
import { NotificationQueryService } from '../services/notification-query.service';
import { NotificationUpdateDto } from '../dto/notification-update.dto';
import { NotificationStatusUpdateDto } from '../dto/notification-status-update.dto';
import { NotificationListQueryDto } from '../dto/notification-list-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import { CreateNotificationDto, CreateNotificationMultipleDto } from '../dto/create-notification.dto';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class NotificationController {
    private readonly notificationCommandService;
    private readonly notificationQueryService;
    constructor(notificationCommandService: NotificationCommandService, notificationQueryService: NotificationQueryService);
    getList(query: NotificationListQueryDto, user: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<NotificationResponseDto>>;
    createNotifications(dto: CreateNotificationDto, user: CurrentUserPayload): Promise<import("../entities/notification.orm-entity").NotificationOrmEntity>;
    createMultipleNotifications(dto: CreateNotificationMultipleDto, user: CurrentUserPayload): Promise<{
        recipientContact: string;
        notificationLink: string | null;
        language: string | null;
        customer?: {
            customerName?: string;
        } | null;
        relatedOrders: number[] | null;
    }[]>;
    getById(id: number): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<NotificationResponseDto>>;
    merchantUpdate(id: number, dto: NotificationUpdateDto): Promise<void>;
    updateStatusSent(id: number, dto: NotificationStatusUpdateDto): Promise<void>;
    adminDelete(id: number): Promise<void>;
}
