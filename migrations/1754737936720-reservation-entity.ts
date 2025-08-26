import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationEntity1754737936720 implements MigrationInterface {
    name = "ReservationEntity1754737936720";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`reservation_status\` enum ('Confirmed', 'Tentative', 'Cancelled', 'Checked-In', 'Checked-Out', 'Pending') NOT NULL DEFAULT 'Tentative'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`status\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`payment_status\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`payment_status\` enum ('Paid', 'Pending', 'Refunded', 'Partially Paid') NOT NULL DEFAULT 'Pending'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_payment_modes\` DROP FOREIGN KEY \`FK_a92a64c5867ac45ef5e92e10483\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`payment_status\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`payment_status\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`status\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`status\` varchar(50) NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`reservation_status\``
        );
    }
}
