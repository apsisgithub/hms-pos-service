import { MigrationInterface, QueryRunner } from "typeorm";

export class ReservationEntity1755154284053 implements MigrationInterface {
    name = "ReservationEntity1755154284053";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`is_rate_includes_taxes\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`is_day_use\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` ADD \`rate_type\` enum ('Rate Per Night', 'Total Rate for Stay') NOT NULL DEFAULT 'Rate Per Night'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`rate_type\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`is_day_use\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_reservations\` DROP COLUMN \`is_rate_includes_taxes\``
        );
    }
}
