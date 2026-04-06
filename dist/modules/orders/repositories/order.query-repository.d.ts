import { FindManyOptions, Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderOrmEntity } from '../entities/order.orm-entity';
import { PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { OrderListQueryDto } from '../dto/order-list-query.dto';
export interface OrderSummary {
    totalOrders: number;
    arrivedOrders: number;
    notArrivedOrders: number;
    paidOrders: number;
    unpaidOrders: number;
}
export interface OrderPaginatedResult {
    success: boolean;
    Code: number;
    message: string;
    results: OrderOrmEntity[];
    pagination: PaginationResponse;
}
export declare class OrderQueryRepository extends BaseQueryRepository<OrderOrmEntity> {
    constructor(repository: Repository<OrderOrmEntity>);
    findWithPagination(options: OrderListQueryDto, manager?: import('typeorm').EntityManager, _relations?: FindManyOptions<OrderOrmEntity>['relations']): Promise<OrderPaginatedResult>;
    getSummary(options: OrderListQueryDto, manager?: import('typeorm').EntityManager): Promise<OrderSummary>;
}
