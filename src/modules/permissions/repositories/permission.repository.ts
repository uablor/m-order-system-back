import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { PermissionOrmEntity } from '../entities/permission.orm-entity';

@Injectable()
export class PermissionRepository extends BaseRepository<PermissionOrmEntity> {
  constructor(
    @InjectRepository(PermissionOrmEntity)
    repository: Repository<PermissionOrmEntity>,
  ) {
    super(repository);
  }
}
