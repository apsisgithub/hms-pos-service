import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterCompanies1754819454814 implements MigrationInterface {
    name = "MasterCompanies1754819454814";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_companies\` ADD \`sbu_id\` int NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_companies\` DROP COLUMN \`sbu_id\``
        );
    }
}
