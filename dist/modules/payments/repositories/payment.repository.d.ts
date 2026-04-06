import { Repository, EntityManager } from 'typeorm';
import { PaymentOrmEntity } from '../entities/payment.orm-entity';
import { PaymentListQueryDto } from '../dto/payment-list-query.dto';
export declare class PaymentRepository {
    private readonly repository;
    constructor(repository: Repository<PaymentOrmEntity>);
    create(data: Partial<PaymentOrmEntity>, manager?: any): Promise<PaymentOrmEntity>;
    findOneBy(conditions: Partial<PaymentOrmEntity>, manager?: any): Promise<PaymentOrmEntity | null>;
    findById(id: number, relations?: string[]): Promise<PaymentOrmEntity | null>;
    findByMerchant(merchantId: number, query: PaymentListQueryDto, manager?: EntityManager): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<PaymentOrmEntity>>;
    findByCustomer(customerId: number, query: PaymentListQueryDto, manager?: EntityManager): Promise<import("../../../common/base/interfaces/response.interface").ResponseWithPaginationInterface<PaymentOrmEntity>>;
    update(id: number, data: Partial<PaymentOrmEntity>, manager?: any): Promise<PaymentOrmEntity>;
    delete(id: number, manager?: any): Promise<void>;
    getSummaryByMerchant(merchantId: number, query: PaymentListQueryDto, manager?: EntityManager): Promise<{
        totalPayments: number;
        totalAmount: string;
        totalPending: number;
        totalVerified: number;
        totalRejected: number;
    }>;
    findByCustomerOrderId(customerOrderId: number, relations?: string[]): Promise<PaymentOrmEntity | null>;
}
