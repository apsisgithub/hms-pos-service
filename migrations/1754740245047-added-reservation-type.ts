import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedReservationType1754740245047 implements MigrationInterface {
    name = "AddedReservationType1754740245047";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` CHANGE \`reservation_status\` \`reservation_type\` enum ('Confirmed', 'Tentative', 'Cancelled', 'Checked-In', 'Checked-Out', 'Pending') NOT NULL DEFAULT 'Tentative'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` CHANGE \`reservation_type\` \`reservation_status\` enum ('Confirmed', 'Tentative', 'Cancelled', 'Checked-In', 'Checked-Out', 'Pending') NOT NULL DEFAULT 'Tentative'`
        );
    }
}
