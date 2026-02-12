import { DeepPartial, EntityManager, FindOptionsWhere } from "typeorm";

export interface IBaseRepository<E> {
    create(data: DeepPartial<E>, manager?: EntityManager): Promise<E>;
    update(id: number, data: DeepPartial<E>, manager?: EntityManager): Promise<E | null>;
    delete(id: number, manager?: EntityManager): Promise<boolean>;
    findOneById(id: number, manager?: EntityManager): Promise<E | null>;
    findOneBy(where: FindOptionsWhere<E>, manager?: EntityManager): Promise<E | null>;
  }