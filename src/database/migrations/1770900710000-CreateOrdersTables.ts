import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrdersTables1770900710000 implements MigrationInterface {
  name = 'CreateOrdersTables1770900710000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE \`orders\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`merchant_id\` int NOT NULL,
        \`created_by\` int NULL,
        \`order_code\` varchar(100) NOT NULL,
        \`order_date\` date NOT NULL,
        \`arrival_status\` varchar(20) NOT NULL DEFAULT 'NOT_ARRIVED',
        \`arrived_at\` datetime NULL,
        \`notified_at\` datetime NULL,
        \`total_purchase_cost_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_shipping_cost_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_cost_before_discount_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_discount_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_final_cost_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_final_cost_thb\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_selling_amount_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_selling_amount_thb\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_profit_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_profit_thb\` decimal(18,2) NOT NULL DEFAULT 0,
        \`deposit_amount\` decimal(18,2) NOT NULL DEFAULT 0,
        \`paid_amount\` decimal(18,2) NOT NULL DEFAULT 0,
        \`remaining_amount\` decimal(18,2) NOT NULL DEFAULT 0,
        \`payment_status\` varchar(20) NOT NULL DEFAULT 'UNPAID',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_orders_merchant\` FOREIGN KEY (\`merchant_id\`) REFERENCES \`merchants\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_orders_created_by\` FOREIGN KEY (\`created_by\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`order_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`order_id\` int NOT NULL,
        \`product_name\` varchar(255) NOT NULL,
        \`variant\` varchar(255) NULL,
        \`quantity\` int NOT NULL DEFAULT 0,
        \`quantity_remaining\` int NOT NULL DEFAULT 0,
        \`purchase_currency\` varchar(10) NOT NULL,
        \`purchase_price\` decimal(18,4) NOT NULL DEFAULT 0,
        \`purchase_exchange_rate\` decimal(18,6) NOT NULL DEFAULT 1,
        \`purchase_total_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_cost_before_discount_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`discount_type\` varchar(10) NULL,
        \`discount_value\` decimal(18,4) NULL,
        \`discount_amount_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`final_cost_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`final_cost_thb\` decimal(18,2) NOT NULL DEFAULT 0,
        \`selling_price_foreign\` decimal(18,4) NOT NULL DEFAULT 0,
        \`selling_exchange_rate\` decimal(18,6) NOT NULL DEFAULT 1,
        \`selling_total_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`profit_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`profit_thb\` decimal(18,2) NOT NULL DEFAULT 0,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_order_items_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`customer_orders\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`order_id\` int NOT NULL,
        \`customer_id\` int NOT NULL,
        \`total_selling_amount_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`total_paid\` decimal(18,2) NOT NULL DEFAULT 0,
        \`remaining_amount\` decimal(18,2) NOT NULL DEFAULT 0,
        \`payment_status\` varchar(20) NOT NULL DEFAULT 'UNPAID',
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_customer_orders_order\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_customer_orders_customer\` FOREIGN KEY (\`customer_id\`) REFERENCES \`customers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE \`customer_order_items\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`customer_order_id\` int NOT NULL,
        \`order_item_id\` int NOT NULL,
        \`quantity\` int NOT NULL DEFAULT 0,
        \`selling_price_foreign\` decimal(18,4) NOT NULL DEFAULT 0,
        \`selling_total_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`profit_lak\` decimal(18,2) NOT NULL DEFAULT 0,
        \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`FK_customer_order_items_customer_order\` FOREIGN KEY (\`customer_order_id\`) REFERENCES \`customer_orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT \`FK_customer_order_items_order_item\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`order_items\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
      ) ENGINE=InnoDB
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`customer_order_items\` DROP FOREIGN KEY \`FK_customer_order_items_order_item\``);
    await queryRunner.query(`ALTER TABLE \`customer_order_items\` DROP FOREIGN KEY \`FK_customer_order_items_customer_order\``);
    await queryRunner.query(`DROP TABLE \`customer_order_items\``);
    await queryRunner.query(`ALTER TABLE \`customer_orders\` DROP FOREIGN KEY \`FK_customer_orders_customer\``);
    await queryRunner.query(`ALTER TABLE \`customer_orders\` DROP FOREIGN KEY \`FK_customer_orders_order\``);
    await queryRunner.query(`DROP TABLE \`customer_orders\``);
    await queryRunner.query(`ALTER TABLE \`order_items\` DROP FOREIGN KEY \`FK_order_items_order\``);
    await queryRunner.query(`DROP TABLE \`order_items\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_created_by\``);
    await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_orders_merchant\``);
    await queryRunner.query(`DROP TABLE \`orders\``);
  }
}
