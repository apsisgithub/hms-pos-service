import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsAssignedToReservationRoom1754292696734 implements MigrationInterface {
    name = 'AddIsAssignedToReservationRoom1754292696734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservation_rooms\` ADD \`is_assigned\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reservation_rooms\` DROP COLUMN \`is_assigned\``);
    }

}
