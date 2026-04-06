import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';
import { CurrentUserPayload } from '../../../common/decorators/current-user.decorator';
import { ResponseInterface, ResponseWithPaginationInterface } from 'src/common/base/interfaces/response.interface';
import { PaymentResponseDto } from '../dto/payment-response.dto';
export declare class PaymentQueryService {
    private readonly paymentRepository;
    constructor(paymentRepository: PaymentRepository);
    getById(id: number): Promise<ResponseInterface<PaymentResponseDto>>;
    getByIdWithOwnership(id: number, currentUser: CurrentUserPayload): Promise<ResponseInterface<PaymentResponseDto>>;
    getList(query: PaymentListQueryDto): Promise<ResponseWithPaginationInterface<PaymentResponseDto>>;
    getListByMerchant(query: PaymentListQueryDto, currentUser: CurrentUserPayload): Promise<ResponseWithPaginationInterface<PaymentResponseDto>>;
    getUnreadPaymentsByMerchant(currentUser: CurrentUserPayload): Promise<ResponseInterface<PaymentResponseDto[]>>;
    getSummaryByMerchant(query: PaymentListQueryDto, currentUser: CurrentUserPayload): Promise<{
        totalPayments: number;
        totalAmount: string;
        totalPending: number;
        totalVerified: number;
        totalRejected: number;
    }>;
    getListByCustomer(query: PaymentListQueryDto, currentUser: CurrentUserPayload): Promise<ResponseWithPaginationInterface<PaymentResponseDto>>;
    getByCustomerOrderId(customerOrderId: number, currentUser?: CurrentUserPayload): Promise<ResponseInterface<PaymentResponseDto> | null>;
}
