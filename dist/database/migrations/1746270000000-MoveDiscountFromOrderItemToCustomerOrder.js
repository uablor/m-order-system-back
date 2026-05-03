"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoveDiscountFromOrderItemToCustomerOrder1746270000000 = void 0;
class MoveDiscountFromOrderItemToCustomerOrder1746270000000 {
    name = 'MoveDiscountFromOrderItemToCustomerOrder1746270000000';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE order_items 
      DROP COLUMN IF EXISTS discount_type,
      DROP COLUMN IF EXISTS discount_value,
      DROP COLUMN IF EXISTS discount_amount
    `);
        await queryRunner.query(`
      ALTER TABLE customer_orders 
      ADD COLUMN discount_type VARCHAR(10) NULL,
      ADD COLUMN discount_value DECIMAL(18, 4) NULL,
      ADD COLUMN discount_amount DECIMAL(18, 2) NOT NULL DEFAULT 0
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE customer_orders 
      DROP COLUMN IF EXISTS discount_type,
      DROP COLUMN IF EXISTS discount_value,
      DROP COLUMN IF EXISTS discount_amount
    `);
        await queryRunner.query(`
      ALTER TABLE order_items 
      ADD COLUMN discount_type VARCHAR(10) NULL,
      ADD COLUMN discount_value DECIMAL(18, 4) NULL,
      ADD COLUMN discount_amount DECIMAL(18, 2) NOT NULL DEFAULT 0
    `);
    }
}
exports.MoveDiscountFromOrderItemToCustomerOrder1746270000000 = MoveDiscountFromOrderItemToCustomerOrder1746270000000;
//# sourceMappingURL=1746270000000-MoveDiscountFromOrderItemToCustomerOrder.js.map