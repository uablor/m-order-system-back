import { MigrationInterface, QueryRunner } from 'typeorm';

export class MoveDiscountFromOrderItemToCustomerOrder1746270000000 implements MigrationInterface {
  name = 'MoveDiscountFromOrderItemToCustomerOrder1746270000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove discount columns from order_items table
    await queryRunner.query(`
      ALTER TABLE order_items 
      DROP COLUMN IF EXISTS discount_type,
      DROP COLUMN IF EXISTS discount_value,
      DROP COLUMN IF EXISTS discount_amount
    `);

    // Add discount columns to customer_orders table
    await queryRunner.query(`
      ALTER TABLE customer_orders 
      ADD COLUMN discount_type VARCHAR(10) NULL,
      ADD COLUMN discount_value DECIMAL(18, 4) NULL,
      ADD COLUMN discount_amount DECIMAL(18, 2) NOT NULL DEFAULT 0
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove discount columns from customer_orders table
    await queryRunner.query(`
      ALTER TABLE customer_orders 
      DROP COLUMN IF EXISTS discount_type,
      DROP COLUMN IF EXISTS discount_value,
      DROP COLUMN IF EXISTS discount_amount
    `);

    // Add discount columns back to order_items table
    await queryRunner.query(`
      ALTER TABLE order_items 
      ADD COLUMN discount_type VARCHAR(10) NULL,
      ADD COLUMN discount_value DECIMAL(18, 4) NULL,
      ADD COLUMN discount_amount DECIMAL(18, 2) NOT NULL DEFAULT 0
    `);
  }
}
