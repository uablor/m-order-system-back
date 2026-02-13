import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateArrivalsAndNotificationsTables1770900720000
  implements MigrationInterface
{
  name = 'CreateArrivalsAndNotificationsTables1770900720000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`arrivals\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`order_id\` int NOT NULL,
        \`merchant_id\` int NOT NULL,
        \`arrived_date\` date NOT NULL,
        \`arrived_time\` time NOT NULL,
        \`recorded_by\` int NULL,
        \`notes\` text NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_arrivals_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_arrivals_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_arrivals_recorded_by\` FOREIGN KEY (\`recorded_by\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`arrival_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`arrival_id\` int NOT NULL,
        \`order_item_id\` int NOT NULL,
        \`arrived_quantity\` int NOT NULL DEFAULT 0,
        \`condition\` varchar(20) NULL,
        \`notes\` text NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_arrival_items_arrival\` FOREIGN KEY (\`arrival_id\`) REFERENCES \`arrivals\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_arrival_items_order_item\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_items\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`notifications\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`merchant_id\` int NOT NULL,
        \`customer_id\` int NOT NULL,
        \`notification_type\` varchar(20) NOT NULL,
        \`channel\` varchar(20) NOT NULL,
        \`recipient_contact\` varchar(255) NOT NULL,
        \`message_content\` text NOT NULL,
        \`notification_link\` text NULL,
        \`retry_count\` int NOT NULL DEFAULT 0,
        \`last_retry_at\` datetime NULL,
        \`status\` varchar(20) NOT NULL,
        \`sent_at\` datetime NULL,
        \`error_message\` text NULL,
        \`related_orders\` json NULL,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_notifications_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_notifications_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_notifications_customer\``);
    await queryRunner.query(`ALTER TABLE \`notifications\` DROP FOREIGN KEY \`FK_notifications_merchant\``);
    await queryRunner.query(`DROP TABLE \`notifications\``);
    await queryRunner.query(`ALTER TABLE \`arrival_items\` DROP FOREIGN KEY \`FK_arrival_items_order_item\``);
    await queryRunner.query(`ALTER TABLE \`arrival_items\` DROP FOREIGN KEY \`FK_arrival_items_arrival\``);
    await queryRunner.query(`DROP TABLE \`arrival_items\``);
    await queryRunner.query(`ALTER TABLE \`arrivals\` DROP FOREIGN KEY \`FK_arrivals_recorded_by\``);
    await queryRunner.query(`ALTER TABLE \`arrivals\` DROP FOREIGN KEY \`FK_arrivals_merchant\``);
    await queryRunner.query(`ALTER TABLE \`arrivals\` DROP FOREIGN KEY \`FK_arrivals_order\``);
    await queryRunner.query(`DROP TABLE \`arrivals\``);
  }
}
