import { PaymentCommandService } from '../services/payment-command.service';
import { PaymentQueryService } from '../services/payment-query.service';
import { PaymentCreateDto } from '../dto/payment-create.dto';
import { PaymentRejectDto, PaymentBulkRejectDto } from '../dto/payment-reject.dto';
import { PaymentBulkActionDto } from '../dto/payment-bulk-action.dto';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import type { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
export declare class PaymentController {
    private readonly commandService;
    private readonly queryService;
    constructor(commandService: PaymentCommandService, queryService: PaymentQueryService);
    create(dto: PaymentCreateDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<import("../entities/payment.orm-entity").PaymentOrmEntity>>;
    getMyPayments(query: PaymentListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<PaymentResponseDto>>;
    getByCustomerOrderId(customerOrderId: number, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<PaymentResponseDto>>;
    getMerchantPayments(query: PaymentListQueryDto, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<PaymentResponseDto>>;
    getMerchantPaymentSummary(query: PaymentListQueryDto, currentUser: CurrentUserPayload): Promise<{
        totalPayments: number;
        totalAmount: string;
        totalPending: number;
        totalVerified: number;
        totalRejected: number;
    }>;
    getUnreadMerchantPayments(currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<PaymentResponseDto[]>>;
    getList(query: PaymentListQueryDto): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<PaymentResponseDto>>;
    getById(id: number, currentUser: CurrentUserPayload): Promise<import("../../../common/base/interfaces/response.interface").ResponseInterface<PaymentResponseDto>>;
    bulkVerify(dto: PaymentBulkActionDto, currentUser: CurrentUserPayload): Promise<import("../entities/payment.orm-entity").PaymentOrmEntity[]>;
    bulkReject(dto: PaymentBulkRejectDto, currentUser: CurrentUserPayload): Promise<import("../entities/payment.orm-entity").PaymentOrmEntity[]>;
    verify(id: number, currentUser: CurrentUserPayload): Promise<import("../entities/payment.orm-entity").PaymentOrmEntity>;
    reject(id: number, dto: PaymentRejectDto, currentUser: CurrentUserPayload): Promise<import("../entities/payment.orm-entity").PaymentOrmEntity>;
    markAsRead(id: number, currentUser: CurrentUserPayload): Promise<import("../entities/payment.orm-entity").PaymentOrmEntity>;
    delete(id: number, currentUser: CurrentUserPayload): Promise<void>;
}
