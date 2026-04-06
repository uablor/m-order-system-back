import { DeepPartial, EntityManager, FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { IBaseRepository } from '../interfaces/repository.interface';
export declare abstract class BaseRepository<E extends {
    id?: number;
}> implements IBaseRepository<E> {
    protected readonly repository: Repository<E>;
    constructor(repository: Repository<E>);
    getRepo(manager?: EntityManager): Repository<E>;
    create(data: DeepPartial<E>, manager?: EntityManager): Promise<E>;
    update(id: number, data: DeepPartial<E>, manager?: EntityManager): Promise<E | null>;
    delete(id: number, manager?: EntityManager): Promise<boolean>;
    findOneById(id: number, manager?: EntityManager, options?: FindOneOptions<E>): Promise<E | null>;
    findOneBy(where: FindOptionsWhere<E>, manager?: EntityManager, options?: FindOneOptions<E>): Promise<E | null>;
    protected getPrimaryColumn(): string;
}
