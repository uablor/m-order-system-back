import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { OrderItemSkuOrmEntity } from '../entities/order-item-sku.orm-entity';

@Injectable()
export class OrderItemSkuRepository extends BaseRepository<OrderItemSkuOrmEntity> {
  constructor(
    @InjectRepository(OrderItemSkuOrmEntity)
    repository: Repository<OrderItemSkuOrmEntity>,
  ) {
    super(repository);
  }
}
