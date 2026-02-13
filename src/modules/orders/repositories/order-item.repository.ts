import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { OrderItemOrmEntity } from '../entities/order-item.orm-entity';

@Injectable()
export class OrderItemRepository extends BaseRepository<OrderItemOrmEntity> {
  constructor(
    @InjectRepository(OrderItemOrmEntity)
    repository: Repository<OrderItemOrmEntity>,
  ) {
    super(repository);
  }
}
