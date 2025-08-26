import { MigrationInterface, QueryRunner } from "typeorm";

export class CompaniesStatusEnum1754820043930 implements MigrationInterface {
    name = "CompaniesStatusEnum1754820043930";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_companies\` DROP COLUMN \`status\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_companies\` ADD \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_companies\` DROP COLUMN \`status\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_companies\` ADD \`status\` tinyint NULL`
        );
    }
}
