import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationBillings1755519802048 implements MigrationInterface {
    name = "ReservationBillings1755519802048";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`market_code_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`business_source_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`travel_agent_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`voucher_no\` varchar(20) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`commission_plan\` enum ('Confirm Booking', 'Non Refundable', 'Corporate') NULL DEFAULT 'Confirm Booking'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`plan_value\` decimal(10,2) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`company_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` ADD \`sales_person_id\` int NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`sales_person_id\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`company_id\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`plan_value\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`commission_plan\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`voucher_no\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`travel_agent_id\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`business_source_id\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` DROP COLUMN \`market_code_id\``
        );
    }
}
