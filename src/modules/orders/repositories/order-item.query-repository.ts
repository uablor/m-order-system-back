import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, SelectQueryBuilder, FindOptionsWhere } from 'typeorm';
import { BaseQueryRepository } from '../../../common/base/repositories/base.query-repository';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';
import { PaginatedResult, PaginationResponse } from '../../../common/base/interfaces/paginted.interface';
import { fetchWithPagination } from '../../../common/utils/pagination.util';
import { OrderItemListQueryDto } from '../dto/order-item-list-query.dto';
import { SortDirection } from 'src/common/base/enums/base.query.enum';

@Injectable()
export class OrderItemQueryRepository extends BaseQueryRepository<OrderItemOrmEntity> {
  constructor(
    @InjectRepository(OrderItemOrmEntity)
    repository: Repository<OrderItemOrmEntity>,
  ) {
    super(repository);
  }

  async findWithPagination(
    options:OrderItemListQueryDto,
    manager?: EntityManager,
  ): Promise<PaginatedResult<OrderItemOrmEntity>> {
    const repo = this.getRepo(manager);
    const qb = repo.createQueryBuilder('orderItem')
      .leftJoinAndSelect('orderItem.order', 'order')
      .leftJoinAndSelect('order.exchangeRateBuy', 'exchangeRateBuy')
      .leftJoinAndSelect('order.exchangeRateSell', 'exchangeRateSell')
      .leftJoinAndSelect('order.shippingExchangeRate', 'shippingExchangeRate')
      .leftJoinAndSelect('orderItem.image', 'image')
      .leftJoinAndSelect('orderItem.skus', 'skus')
      .leftJoinAndSelect('skus.exchangeRateBuy', 'skuExchangeRateBuy')
      .leftJoinAndSelect('skus.exchangeRateSell', 'skuExchangeRateSell');


    if (options.orderId != null) {
      qb.andWhere('order.id = :orderId', { orderId: options.orderId });
    } else if (options.merchantId != null) {
      qb.andWhere('order.merchant_id = :merchantId', { merchantId: options.merchantId });
    }

    if (options.orderItemSkuId != null) {
      qb.andWhere('skus.id = :orderItemSkuId', { orderItemSkuId: options.orderItemSkuId });
    }

    qb.orderBy('orderItem.id', 'DESC');

    return fetchWithPagination({
      qb,
      page: options.page ?? 1,
      limit: options.limit ?? 10,
      sort: options.sort ?? SortDirection.DESC,
      search: options.search ? { kw: options.search, field: options.searchField ?? 'orderItem.productName' } : undefined,
      manager: manager || repo.manager,
    });
  }
}
