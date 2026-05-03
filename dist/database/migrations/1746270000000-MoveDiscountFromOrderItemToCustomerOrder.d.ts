import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class MoveDiscountFromOrderItemToCustomerOrder1746270000000 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
