import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifiedBusinessSource1754814192935 implements MigrationInterface {
    name = "ModifiedBusinessSource1754814192935";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX \`composite_idx_name_code\` ON \`master_business_sources\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`code\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`bin\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`color_tag\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`short_code\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`market_code\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`registration_no\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`color_code\` varchar(10) NULL`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_name_code\` ON \`master_business_sources\` (\`name\`, \`short_code\`, \`sbu_id\`, \`status\`)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP INDEX \`composite_idx_name_code\` ON \`master_business_sources\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`color_code\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`registration_no\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`market_code\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` DROP COLUMN \`short_code\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`color_tag\` varchar(10) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`bin\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_business_sources\` ADD \`code\` varchar(50) NULL`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_name_code\` ON \`master_business_sources\` (\`name\`, \`code\`, \`sbu_id\`, \`status\`)`
        );
    }
}
