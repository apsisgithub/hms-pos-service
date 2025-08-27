import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationBillingsBottomCheckboxFields1754804404125
    implements MigrationInterface
{
    name = "ReservationBillingsBottomCheckboxFields1754804404125";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`suppress_rate_on_gr_card\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`display_inclusion_separately_on_folio\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`apply_to_group\` tinyint NOT NULL DEFAULT 0`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`apply_to_group\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`display_inclusion_separately_on_folio\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`suppress_rate_on_gr_card\``
        );
    }
}
