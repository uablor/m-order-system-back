import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { CustomerOrmEntity } from '../entities/customer.orm-entity';

@Injectable()
export class CustomerRepository extends BaseRepository<CustomerOrmEntity> {
  constructor(
    @InjectRepository(CustomerOrmEntity)
    repository: Repository<CustomerOrmEntity>,
  ) {
    super(repository);
  }
}
