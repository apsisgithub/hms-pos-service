import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationGuests1754993662917 implements MigrationInterface {
    name = "ReservationGuests1754993662917";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_guests\` ADD \`room_id\` int NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservation_guests\` DROP COLUMN \`room_id\``
        );
    }
}
