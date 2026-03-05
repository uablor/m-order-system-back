import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationLanguage1741000000000 implements MigrationInterface {
  name = 'AddNotificationLanguage1741000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`notifications\` ADD COLUMN \`language\` varchar(10) NULL DEFAULT 'en' AFTER \`related_orders\``,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`language\``);
  }
}
