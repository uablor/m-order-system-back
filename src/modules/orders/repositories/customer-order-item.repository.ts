import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { CustomerOrderItemOrmEntity } from '../entities/customer-order-item.orm-entity';

@Injectable()
export class CustomerOrderItemRepository extends BaseRepository<CustomerOrderItemOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrderItemOrmEntity)
    repository: Repository<CustomerOrderItemOrmEntity>,
  ) {
    super(repository);
  }
}
