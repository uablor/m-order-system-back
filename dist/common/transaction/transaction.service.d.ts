import { DataSource, EntityManager } from 'typeorm';
export declare class TransactionService {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    run<T>(fn: (manager: EntityManager) => Promise<T>): Promise<T>;
}
