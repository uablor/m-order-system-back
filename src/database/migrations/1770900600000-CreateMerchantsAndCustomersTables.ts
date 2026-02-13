import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMerchantsAndCustomersTables1770900600000
  implements MigrationInterface
{
  name = 'CreateMerchantsAndCustomersTables1770900600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`merchants\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`owner_user_id\` int NOT NULL,
        \`shop_name\` varchar(255) NOT NULL,
        \`shop_logo_url\` text NULL,
        \`shop_address\` text NULL,
        \`contact_phone\` varchar(50) NULL,
        \`contact_email\` varchar(255) NULL,
        \`contact_facebook\` text NULL,
        \`contact_line\` text NULL,
        \`contact_whatsapp\` varchar(50) NULL,
        \`default_currency\` varchar(10) NOT NULL DEFAULT 'THB',
        \`is_active\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_merchants_owner_user\` FOREIGN KEY (\`owner_user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`customers\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`merchant_id\` int NOT NULL,
        \`customer_name\` varchar(255) NOT NULL,
        \`customer_type\` varchar(20) NOT NULL,
        \`shipping_address\` text NULL,
        \`shipping_provider\` varchar(100) NULL,
        \`shipping_source\` varchar(255) NULL,
        \`shipping_destination\` varchar(255) NULL,
        \`payment_terms\` text NULL,
        \`contact_phone\` varchar(50) NULL,
        \`contact_facebook\` text NULL,
        \`contact_whatsapp\` varchar(50) NULL,
        \`contact_line\` text NULL,
        \`preferred_contact_method\` varchar(20) NULL,
        \`unique_token\` varchar(255) NOT NULL,
        \`is_active\` tinyint NOT NULL DEFAULT 1,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        UNIQUE INDEX \`IDX_customers_unique_token\` (\`unique_token\`),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_customers_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customers\` DROP FOREIGN KEY \`FK_customers_merchant\``);
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(`ALTER TABLE \`merchants\` DROP FOREIGN KEY \`FK_merchants_owner_user\``);
    await queryRunner.query(`DROP TABLE \`merchants\``);
  }
}
