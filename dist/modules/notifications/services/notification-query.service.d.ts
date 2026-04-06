import { NotificationRepository } from '../repositories/notification.repository';
import { NotificationQueryRepository } from '../repositories/notification.query-repository';
import { NotificationListQueryDto } from '../dto/notification-list-query.dto';
import { NotificationResponseDto } from '../dto/notification-response.dto';
import type { ResponseInterface, ResponseWithPaginationInterface } from '../../../common/base/interfaces/response.interface';
import type { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
export declare class NotificationQueryService {
    private readonly notificationRepository;
    private readonly notificationQueryRepository;
    constructor(notificationRepository: NotificationRepository, notificationQueryRepository: NotificationQueryRepository);
    getById(id: number): Promise<NotificationResponseDto | null>;
    getByIdOrFail(id: number): Promise<ResponseInterface<NotificationResponseDto>>;
    getList(query: NotificationListQueryDto, user?: CurrentUserPayload): Promise<ResponseWithPaginationInterface<NotificationResponseDto>>;
    private toResponse;
}
