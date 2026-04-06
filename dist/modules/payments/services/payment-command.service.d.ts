import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { PaymentRejectDto, PaymentBulkRejectDto } from '../dto/payment-reject.dto';
import { TransactionService } from '../../../common/transaction/transaction.service';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { ImageQueryRepository } from 'src/modules/images/repositories/image.query-repository';
import { CustomerOrderRepository } from 'src/modules/orders/repositories/customer-order.repository';
import { OrderRepository } from 'src/modules/orders/repositories/order.repository';
export declare class PaymentCommandService {
    private readonly paymentRepository;
    private readonly transactionService;
    private readonly imageQueryRepository;
    private readonly orderRepository;
    private readonly customerOrderRepository;
    constructor(paymentRepository: PaymentRepository, transactionService: TransactionService, imageQueryRepository: ImageQueryRepository, orderRepository: OrderRepository, customerOrderRepository: CustomerOrderRepository);
    create(dto: PaymentCreateDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<PaymentOrmEntity>>;
    delete(id: number): Promise<void>;
    private rejectInternal;
    reject(id: number, dto: PaymentRejectDto, currentUser: CurrentUserPayload): Promise<PaymentOrmEntity>;
    bulkReject(dto: PaymentBulkRejectDto, currentUser: CurrentUserPayload): Promise<PaymentOrmEntity[]>;
    private verifyInternal;
    verify(id: number, currentUser: CurrentUserPayload): Promise<PaymentOrmEntity>;
    bulkVerify(paymentIds: number[], currentUser: CurrentUserPayload): Promise<PaymentOrmEntity[]>;
    markAsRead(id: number, currentUser: CurrentUserPayload): Promise<PaymentOrmEntity>;
}
