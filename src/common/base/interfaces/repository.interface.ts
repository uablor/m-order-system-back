import { DeepPartial, EntityManager, FindOneOptions, FindOptionsWhere } from "typeorm";

export interface IBaseRepository<E> {
    create(data: DeepPartial<E>, manager?: EntityManager): Promise<E>;
    update(id: number, data: DeepPartial<E>, manager?: EntityManager): Promise<E | null>;
    delete(id: number, manager?: EntityManager): Promise<boolean>;
    findOneById(id: number, manager?: EntityManager, options?: FindOneOptions<E>): Promise<E | null>;
    findOneBy(where: FindOptionsWhere<E>, manager?: EntityManager, options?: FindOneOptions<E>): Promise<E | null>;
  }