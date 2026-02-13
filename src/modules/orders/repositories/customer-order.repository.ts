import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { CustomerOrderOrmEntity } from '../entities/customer-order.orm-entity';

@Injectable()
export class CustomerOrderRepository extends BaseRepository<CustomerOrderOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrderOrmEntity)
    repository: Repository<CustomerOrderOrmEntity>,
  ) {
    super(repository);
  }
}
