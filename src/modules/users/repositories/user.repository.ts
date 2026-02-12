import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/base.repository';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserRepository extends BaseRepository<UserOrmEntity> {
  constructor(
    @InjectRepository(UserOrmEntity)
    repository: Repository<UserOrmEntity>,
  ) {
    super(repository);
  }
}
