import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateRolePermissionsTable1739110000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role_permissions',
        columns: [
          {
            name: 'role_id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
          {
            name: 'permission_id',
            type: 'varchar',
            length: '36',
            isPrimary: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['role_id'],
        referencedColumnNames: ['role_id'],
        referencedTableName: 'roles',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'role_permissions',
      new TableForeignKey({
        columnNames: ['permission_id'],
        referencedColumnNames: ['permission_id'],
        referencedTableName: 'permissions',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('role_permissions');
    if (table) {
      const fkRole = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('role_id') !== -1,
      );
      const fkPermission = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('permission_id') !== -1,
      );
      if (fkRole) await queryRunner.dropForeignKey('role_permissions', fkRole);
      if (fkPermission)
        await queryRunner.dropForeignKey('role_permissions', fkPermission);
    }
    await queryRunner.dropTable('role_permissions', true);
  }
}
