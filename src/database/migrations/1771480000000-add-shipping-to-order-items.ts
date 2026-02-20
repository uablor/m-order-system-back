import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddShippingToOrderItems1771480000000 implements MigrationInterface {
  name = 'AddShippingToOrderItems1771480000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'order_items',
      new TableColumn({
        name: 'shipping_price',
        type: 'decimal',
        precision: 18,
        scale: 4,
        isNullable: true,
        default: '0',
      }),
    );

    await queryRunner.addColumn(
      'order_items',
      new TableColumn({
        name: 'shipping_lak',
        type: 'decimal',
        precision: 18,
        scale: 2,
        isNullable: false,
        default: '0',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('order_items', 'shipping_lak');
    await queryRunner.dropColumn('order_items', 'shipping_price');
  }
}
