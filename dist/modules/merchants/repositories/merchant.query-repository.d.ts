import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import { MerchantListOptionsQueryDto } from '../dto/merchant-list-query.dto';
export declare class MerchantQueryRepository extends BaseQueryRepository<MerchantOrmEntity> {
    constructor(repository: Repository<MerchantOrmEntity>);
    findWithPagination(options: MerchantListOptionsQueryDto, manager: import('typeorm').EntityManager): Promise<PaginatedResult<MerchantOrmEntity>>;
    findMerchantDetail(ownerUserId: number, manager: import('typeorm').EntityManager): Promise<MerchantOrmEntity | null>;
    findByIdWithOwner(id: number, manager: import('typeorm').EntityManager): Promise<MerchantOrmEntity | null>;
    findUsersByMerchantId(merchantId: number, manager: import('typeorm').EntityManager): Promise<UserOrmEntity[]>;
    findCustomersByMerchantId(merchantId: number, manager: import('typeorm').EntityManager): Promise<CustomerOrmEntity[]>;
    getFinancialSummaryByMerchantId(merchantId: number, manager: import('typeorm').EntityManager): Promise<{
        totalOrders: number;
        ordersUnpaid: number;
        ordersPartial: number;
        ordersPaid: number;
        totalIncomeLak: number;
        totalExpenseLak: number;
        totalProfitLak: number;
        totalPaidAmount: number;
        totalRemainingAmount: number;
    }>;
    getFinancialByCurrency(merchantId: number, manager: import('typeorm').EntityManager): Promise<{
        baseCurrency: string;
        totalOrders: number;
        totalIncomeLak: number;
        totalExpenseLak: number;
        totalProfitLak: number;
    }[]>;
}
