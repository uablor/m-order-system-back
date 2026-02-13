import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExchangeRatesTable1770900700000 implements MigrationInterface {
  name = 'CreateExchangeRatesTable1770900700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`exchange_rates\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`merchant_id\` int NOT NULL,
        \`base_currency\` varchar(10) NOT NULL,
        \`target_currency\` varchar(10) NOT NULL,
        \`rate_type\` varchar(10) NOT NULL,
        \`rate\` decimal(18,6) NOT NULL DEFAULT 0,
        \`is_active\` tinyint NOT NULL DEFAULT 1,
        \`rate_date\` date NOT NULL,
        \`created_by\` int NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_exchange_rates_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_exchange_rates_created_by\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`exchange_rates\` DROP FOREIGN KEY \`FK_exchange_rates_created_by\``);
    await queryRunner.query(`ALTER TABLE \`exchange_rates\` DROP FOREIGN KEY \`FK_exchange_rates_merchant\``);
    await queryRunner.query(`DROP TABLE \`exchange_rates\``);
  }
}
