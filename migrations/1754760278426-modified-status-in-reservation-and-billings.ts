import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedStatusInReservationAndBillings1754760278426
    implements MigrationInterface
{
    name = "ModifiedStatusInReservationAndBillings1754760278426";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` CHANGE \`reservation_type\` \`reservation_type\` enum ('Confirm Booking', 'Hold Confirm Booking', 'Hold Unconfirm Booking', 'Online Failed Booking', 'Released', 'Unconfirmed Booking Inquiry') NOT NULL DEFAULT 'Hold Confirm Booking'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` CHANGE \`status\` \`status\` enum ('Confirmed', 'Tentative', 'Cancelled', 'CheckedIn', 'CheckedOut', 'Pending') NOT NULL DEFAULT 'Confirmed'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` CHANGE \`status\` \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_billing_details\` CHANGE \`reservation_type\` \`reservation_type\` enum ('Confirm Booking', 'Tentative Booking', 'Cancelled') NOT NULL DEFAULT 'Confirm Booking'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`reservation_type\` enum ('Confirmed', 'Tentative', 'Cancelled', 'Checked-In', 'Checked-Out', 'Pending') NOT NULL DEFAULT 'Tentative'`
        );
    }
}
