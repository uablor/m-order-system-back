import { DeepPartial, EntityManager, Repository } from 'typeorm';
import { MerchantOrmEntity } from '../entities/merchant.orm-entity';
export declare class MerchantRepository {
    protected readonly repository: Repository<MerchantOrmEntity>;
    constructor(repository: Repository<MerchantOrmEntity>);
    getRepo(manager?: EntityManager): Repository<MerchantOrmEntity>;
    create(data: DeepPartial<MerchantOrmEntity>, manager?: EntityManager): Promise<MerchantOrmEntity>;
    update(id: number, data: DeepPartial<MerchantOrmEntity>, manager?: EntityManager): Promise<MerchantOrmEntity | null>;
    delete(id: number, manager?: EntityManager): Promise<boolean>;
    findOneById(id: number, manager?: EntityManager): Promise<MerchantOrmEntity | null>;
    findOneByOwnerUserId(ownerUserId: number, manager?: EntityManager): Promise<MerchantOrmEntity | null>;
}
