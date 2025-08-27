import { MigrationInterface, QueryRunner } from "typeorm";

export class Folio1755520174924 implements MigrationInterface {
    name = "Folio1755520174924";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_folios\` ADD \`room_id\` int NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_folios\` DROP COLUMN \`room_id\``
        );
    }
}
