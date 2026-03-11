import { MigrationInterface, QueryRunner } from "typeorm";

export class AddReadAtToPayments1775118800000 implements MigrationInterface {
    name = 'AddReadAtToPayments1775118800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`read_at\` timestamp NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`read_at\``);
    }

}
