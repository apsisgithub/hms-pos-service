import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyMasterRateType1754251525201 implements MigrationInterface {
    name = 'ModifyMasterRateType1754251525201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_rate_types\` DROP COLUMN \`is_package\``);
        await queryRunner.query(`ALTER TABLE \`master_permission_actions\` DROP COLUMN \`sbu_id\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_permission_actions\` ADD \`sbu_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_rate_types\` ADD \`is_package\` tinyint NOT NULL DEFAULT '0'`);
    }

}
