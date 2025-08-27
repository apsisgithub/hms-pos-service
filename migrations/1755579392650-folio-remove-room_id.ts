import { MigrationInterface, QueryRunner } from "typeorm";

export class FolioRemoveRoomId1755579392650 implements MigrationInterface {
    name = "FolioRemoveRoomId1755579392650";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_folios\` DROP COLUMN \`room_id\``
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_folios\` ADD \`room_id\` int NOT NULL`
        );
    }
}
