import { DeepPartial, EntityManager, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { EntityTarget } from 'typeorm/common/EntityTarget';
import { IBaseRepository } from '../interfaces/repository.interface';



export abstract class BaseRepository<E extends { id?: number }> implements IBaseRepository<E> {
  constructor(protected readonly repository: Repository<E>) {}

  getRepo(manager?: EntityManager): Repository<E> {
    return manager
    ? manager.getRepository(this.repository.target as EntityTarget<E>)
    : this.repository;
  }

  async create(data: DeepPartial<E>, manager?: EntityManager): Promise<E> {
    const repo = manager ? manager.getRepository(this.repository.target as EntityTarget<E>) : this.repository;
    const entity = repo.create(data as DeepPartial<E>);
    return repo.save(entity);
  }

  async update(id: number, data: DeepPartial<E>, manager?: EntityManager): Promise<E | null> {
    const repo = manager ? manager.getRepository(this.repository.target as EntityTarget<E>) : this.repository;
    const criteria = { [this.getPrimaryColumn()]: id } as FindOptionsWhere<E>;
    await repo.update(criteria, data as never);
    return repo.findOne({ where: criteria });
  }

  async delete(id: number, manager?: EntityManager): Promise<boolean> {
    const repo = manager ? manager.getRepository(this.repository.target as EntityTarget<E>) : this.repository;
    const criteria = { [this.getPrimaryColumn()]: id } as FindOptionsWhere<E>;
    const result = await repo.delete(criteria);
    return (result.affected ?? 0) > 0;
  }

  async findOneById(id: number, manager?: EntityManager, options?: FindOneOptions<E>): Promise<E | null> {
    const repo = manager ? manager.getRepository(this.repository.target as EntityTarget<E>) : this.repository;
    return repo.findOne({ where: { [this.getPrimaryColumn()]: id } as FindOptionsWhere<E>, ...options });
  }

  async findOneBy(where: FindOptionsWhere<E>,  manager?: EntityManager, options?: FindOneOptions<E>,): Promise<E | null> {
    const repo = manager ? manager.getRepository(this.repository.target as EntityTarget<E>) : this.repository;
    return repo.findOne({ where, ...options });
  }

  protected getPrimaryColumn(): string {
    return 'id';
  }
}
