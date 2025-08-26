import { MigrationInterface, QueryRunner } from "typeorm";

export class DisplaySettings1755514388017 implements MigrationInterface {
    name = "DisplaySettings1755514388017";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`generate_invoice_on_checkout\` tinyint NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`generate_invoice_on_cancel\` tinyint NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`generate_invoice_on_no_show\` tinyint NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`generate_single_invoice_for_groups\` tinyint NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`no_charge_void_charge_folio\` tinyint NULL DEFAULT 0`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`no_charge_void_charge_folio\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`generate_single_invoice_for_groups\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`generate_invoice_on_no_show\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`generate_invoice_on_cancel\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`generate_invoice_on_checkout\``
        );
    }
}
