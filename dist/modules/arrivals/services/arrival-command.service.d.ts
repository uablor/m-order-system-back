import { TransactionService } from '../../../common/transaction/transaction.service';
import { ArrivalRepository } from '../repositories/arrival.repository';
import { ArrivalItemRepository } from '../repositories/arrival-item.repository';
import { OrderRepository } from '../../orders/repositories/order.repository';
import { MerchantRepository } from '../../merchants/repositories/merchant.repository';
import { CreateArrivalDto } from '../dto/create-arrival.dto';
import { ArrivalUpdateDto } from '../dto/arrival-update.dto';
import { CreateMultipleArrivalsDto } from '../dto/create-multiple-arrivals.dto';
import { CurrentUserPayload } from 'src/common/decorators/current-user.decorator';
import { NotificationCommandService } from 'src/modules/notifications/services/notification-command.service';
export declare class ArrivalCommandService {
    private readonly transactionService;
    private readonly arrivalRepository;
    private readonly arrivalItemRepository;
    private readonly orderRepository;
    private readonly merchantRepository;
    private readonly notificationCommandService;
    constructor(transactionService: TransactionService, arrivalRepository: ArrivalRepository, arrivalItemRepository: ArrivalItemRepository, orderRepository: OrderRepository, merchantRepository: MerchantRepository, notificationCommandService: NotificationCommandService);
    create(dto: CreateArrivalDto, currentUser: CurrentUserPayload): Promise<{
        success: true;
        arrival: object;
        message: string;
    }>;
    createMultiple(dto: CreateMultipleArrivalsDto, currentUser: CurrentUserPayload): Promise<{
        success: true;
        arrivals: object[];
        message: string;
        processedOrders: number;
        failedOrders: Array<{
            orderId: number;
            error: string;
        }>;
        notifications: Array<{
            recipientContact: string;
            notificationLink: string | null;
            language: string | null;
            customer?: {
                customerName?: string;
            } | null;
            relatedOrders: number[] | null;
        }>;
    }>;
    update(id: number, dto: ArrivalUpdateDto): Promise<void>;
    delete(id: number): Promise<void>;
}
