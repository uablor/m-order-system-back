import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
import { UserOrmEntity } from '../../users/entities/user.orm-entity';
import { CustomerOrmEntity } from '../../customers/entities/customer.orm-entity';
import { OrderOrmEntity } from '../../orders/entities/order.orm-entity';
import { PaginatedResult } from '../../../common/base/interfaces/paginted.interface';
import {
  MerchantListOptionsQueryDto,
  MerchantListQueryDto,
} from '../dto/merchant-list-query.dto';
import { fetchWithPagination } from 'src/common/utils/pagination.util';

@Injectable()
export class MerchantQueryRepository extends BaseQueryRepository<MerchantOrmEntity> {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    repository: Repository<MerchantOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options: MerchantListOptionsQueryDto,
    manager: import('typeorm').EntityManager,
  ): Promise<PaginatedResult<MerchantOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');

    if (options.ownerUserId != null) {
      qb.andWhere('entity.ownerUserId = :ownerUserId', {
        ownerUserId: options.ownerUserId,
      });
    }

    return fetchWithPagination<MerchantOrmEntity>({
      qb,
      sort: options.sort,
      search: options.search?.trim()
        ? { kw: options.search.trim(), field: options.searchField || 'shopName' }
        : undefined,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      manager: repo.manager,
    });
  }

  async findMerchantDetail(
    ownerUserId: number,
    manager: import('typeorm').EntityManager,
  ): Promise<MerchantOrmEntity | null> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('entity');
    qb.where('entity.ownerUserId = :ownerUserId', { ownerUserId });
    qb.leftJoinAndSelect('entity.ownerUser', 'ownerUser');
    return qb.getOne();
  }

  async findByIdWithOwner(
    id: number,
    manager: import('typeorm').EntityManager,
  ): Promise<MerchantOrmEntity | null> {
    const repo = this.getRepo(manager);
    return repo
      .createQueryBuilder('m')
      .leftJoinAndSelect('m.ownerUser', 'owner')
      .leftJoinAndSelect('owner.role', 'ownerRole')
      .where('m.id = :id', { id })
      .getOne();
  }

  async findUsersByMerchantId(
    merchantId: number,
    manager: import('typeorm').EntityManager,
  ): Promise<UserOrmEntity[]> {
    return manager
      .getRepository(UserOrmEntity)
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.role', 'role')
      .where('u.merchantId = :merchantId', { merchantId })
      .orderBy('u.createdAt', 'DESC')
      .getMany();
  }

  async findCustomersByMerchantId(
    merchantId: number,
    manager: import('typeorm').EntityManager,
  ): Promise<CustomerOrmEntity[]> {
    return manager
      .getRepository(CustomerOrmEntity)
      .createQueryBuilder('c')
      .where('c.merchant_id = :merchantId', { merchantId })
      .orderBy('c.createdAt', 'DESC')
      .getMany();
  }

  async getFinancialSummaryByMerchantId(
    merchantId: number,
    manager: import('typeorm').EntityManager,
  ): Promise<{
    totalOrders: number;
    ordersUnpaid: number;
    ordersPartial: number;
    ordersPaid: number;
    totalIncomeLak: number;
    totalIncomeThb: number;
    totalExpenseLak: number;
    totalExpenseThb: number;
    totalProfitLak: number;
    totalProfitThb: number;
    totalPaidAmount: number;
    totalRemainingAmount: number;
  }> {
    const raw = await manager
      .getRepository(OrderOrmEntity)
      .createQueryBuilder('o')
      .select('COUNT(o.id)', 'totalOrders')
      .addSelect(`SUM(CASE WHEN o.payment_status = 'UNPAID' THEN 1 ELSE 0 END)`, 'ordersUnpaid')
      .addSelect(`SUM(CASE WHEN o.payment_status = 'PARTIAL' THEN 1 ELSE 0 END)`, 'ordersPartial')
      .addSelect(`SUM(CASE WHEN o.payment_status = 'PAID' THEN 1 ELSE 0 END)`, 'ordersPaid')
      .addSelect('COALESCE(SUM(o.total_selling_amount_lak), 0)', 'totalIncomeLak')
      .addSelect('COALESCE(SUM(o.total_selling_amount_thb), 0)', 'totalIncomeThb')
      .addSelect('COALESCE(SUM(o.total_final_cost_lak), 0)', 'totalExpenseLak')
      .addSelect('COALESCE(SUM(o.total_final_cost_thb), 0)', 'totalExpenseThb')
      .addSelect('COALESCE(SUM(o.total_profit_lak), 0)', 'totalProfitLak')
      .addSelect('COALESCE(SUM(o.total_profit_thb), 0)', 'totalProfitThb')
      .addSelect('COALESCE(SUM(o.paid_amount), 0)', 'totalPaidAmount')
      .addSelect('COALESCE(SUM(o.remaining_amount), 0)', 'totalRemainingAmount')
      .where('o.merchant_id = :merchantId', { merchantId })
      .getRawOne();

    return {
      totalOrders: Number(raw?.totalOrders ?? 0),
      ordersUnpaid: Number(raw?.ordersUnpaid ?? 0),
      ordersPartial: Number(raw?.ordersPartial ?? 0),
      ordersPaid: Number(raw?.ordersPaid ?? 0),
      totalIncomeLak: Number(raw?.totalIncomeLak ?? 0),
      totalIncomeThb: Number(raw?.totalIncomeThb ?? 0),
      totalExpenseLak: Number(raw?.totalExpenseLak ?? 0),
      totalExpenseThb: Number(raw?.totalExpenseThb ?? 0),
      totalProfitLak: Number(raw?.totalProfitLak ?? 0),
      totalProfitThb: Number(raw?.totalProfitThb ?? 0),
      totalPaidAmount: Number(raw?.totalPaidAmount ?? 0),
      totalRemainingAmount: Number(raw?.totalRemainingAmount ?? 0),
    };
  }
}
