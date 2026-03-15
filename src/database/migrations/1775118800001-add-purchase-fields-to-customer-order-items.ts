import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPurchaseFieldsToCustomerOrderItems1775118800001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumns('customer_order_items', [
      new TableColumn({
        name: 'purchase_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
      }),
      new TableColumn({
        name: 'purchase_total',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumns('customer_order_items', [
      new TableColumn({
        name: 'purchase_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
      }),
      new TableColumn({
        name: 'purchase_total',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
      }),
    ]);
  }
}
