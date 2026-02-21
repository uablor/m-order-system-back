import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/base/repositories/base.repository';
import { NotificationOrmEntity } from '../entities/notification.orm-entity';

@Injectable()
export class NotificationRepository extends BaseRepository<NotificationOrmEntity> {
  constructor(
    @InjectRepository(NotificationOrmEntity)
    repository: Repository<NotificationOrmEntity>,
  ) {
    super(repository);
  }
}
