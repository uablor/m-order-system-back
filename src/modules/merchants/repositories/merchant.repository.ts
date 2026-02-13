import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';

@Injectable()
export class MerchantRepository {
  constructor(
    @InjectRepository(MerchantOrmEntity)
    protected readonly repository: Repository<MerchantOrmEntity>,
  ) {}

  getRepo(manager?: EntityManager): Repository<MerchantOrmEntity> {
    return manager
      ? manager.getRepository(MerchantOrmEntity)
      : this.repository;
  }

  async create(
    data: DeepPartial<MerchantOrmEntity>,
    manager?: EntityManager,
  ): Promise<MerchantOrmEntity> {
    const repo = this.getRepo(manager);
    const entity = repo.create(data);
    return repo.save(entity);
  }

  async update(
    id: number,
    data: DeepPartial<MerchantOrmEntity>,
    manager?: EntityManager,
  ): Promise<MerchantOrmEntity | null> {
    const repo = this.getRepo(manager);
    await repo.update({ id }, data as never);
    return repo.findOne({ where: { id } });
  }

  async delete(id: number, manager?: EntityManager): Promise<boolean> {
    const repo = this.getRepo(manager);
    const result = await repo.delete({ id });
    return (result.affected ?? 0) > 0;
  }

  async findOneById(id: number, manager?: EntityManager): Promise<MerchantOrmEntity | null> {
    return this.getRepo(manager).findOne({ where: { id } });
  }

  async findOneByOwnerUserId(
    ownerUserId: number,
    manager?: EntityManager,
  ): Promise<MerchantOrmEntity | null> {
    return this.getRepo(manager).findOne({ where: { ownerUserId } });
  }
}
