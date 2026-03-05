import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateSchema1772685975659 implements MigrationInterface {
    name = 'UpdateSchema1772685975659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_orders\` DROP FOREIGN KEY \`FK_customer_orders_notification\``);
        await queryRunner.query(`DROP INDEX \`IDX_notifications_unique_token\` ON \`notifications\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`status_sent\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`arrival_status\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`arrival_status\` enum ('NOT_ARRIVED', 'ARRIVED') NOT NULL DEFAULT 'NOT_ARRIVED'`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`payment_status\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`payment_status\` enum ('NOT_CREATED', 'UNPAID', 'PAID') NOT NULL DEFAULT 'NOT_CREATED'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`notification_type\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`notification_type\` enum ('ARRIVAL', 'PAYMENT', 'REMINDER') NOT NULL DEFAULT 'ARRIVAL'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`channel\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`channel\` enum ('FB', 'LINE', 'WHATSAPP') NOT NULL DEFAULT 'FB'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`status\` enum ('PENDING', 'SENT', 'FAILED', 'CANCELLED') NOT NULL DEFAULT 'SENT'`);
        await queryRunner.query(`ALTER TABLE \`customer_orders\` DROP COLUMN \`payment_status\``);
        await queryRunner.query(`ALTER TABLE \`customer_orders\` ADD \`payment_status\` enum ('NOT_CREATED', 'UNPAID', 'PAID') NOT NULL DEFAULT 'NOT_CREATED'`);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`status\` enum ('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`customer_orders\` ADD CONSTRAINT \`FK_5d5679ecd0d56701f2e7ff69692\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notifications\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`customer_orders\` DROP FOREIGN KEY \`FK_5d5679ecd0d56701f2e7ff69692\``);
        await queryRunner.query(`ALTER TABLE \`payments\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`payments\` ADD \`status\` varchar(20) NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`ALTER TABLE \`customer_orders\` DROP COLUMN \`payment_status\``);
        await queryRunner.query(`ALTER TABLE \`customer_orders\` ADD \`payment_status\` varchar(20) NOT NULL DEFAULT 'UNPAID'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`status\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`channel\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`channel\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`notifications\` DROP COLUMN \`notification_type\``);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`notification_type\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`payment_status\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`payment_status\` varchar(20) NOT NULL DEFAULT 'UNPAID'`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`arrival_status\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`arrival_status\` varchar(20) NOT NULL DEFAULT 'NOT_ARRIVED'`);
        await queryRunner.query(`ALTER TABLE \`notifications\` ADD \`status_sent\` enum ('PENDING', 'SENT', 'CANCELLED') NOT NULL DEFAULT 'PENDING'`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_notifications_unique_token\` ON \`notifications\` (\`unique_token\`)`);
        await queryRunner.query(`ALTER TABLE \`customer_orders\` ADD CONSTRAINT \`FK_customer_orders_notification\` FOREIGN KEY (\`notification_id\`) REFERENCES \`notifications\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

}
