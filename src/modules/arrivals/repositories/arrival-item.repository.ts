import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { ArrivalItemOrmEntity } from '../entities/arrival-item.orm-entity';

@Injectable()
export class ArrivalItemRepository extends BaseRepository<ArrivalItemOrmEntity> {
  constructor(
    @InjectRepository(ArrivalItemOrmEntity)
    repository: Repository<ArrivalItemOrmEntity>,
  ) {
    super(repository);
  }
}
