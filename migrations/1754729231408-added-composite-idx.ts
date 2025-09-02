import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedCompositeIdx1754729231408 implements MigrationInterface {
    name = "AddedCompositeIdx1754729231408";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_name_short_code\` ON \`master_business_agents\` (\`name\`, \`short_code\`, \`sbu_id\`, \`deleted_at\`)`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_name_code\` ON \`master_business_sources\` (\`name\`, \`code\`, \`sbu_id\`, \`deleted_at\`)`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_currencyCode\` ON \`master_currencies\` (\`currency_code\`, \`sbu_id\`, \`deleted_at\`)`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_name\` ON \`master_sbu\` (\`name\`, \`email\`, \`deleted_at\`)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_payment_modes\` DROP FOREIGN KEY \`FK_a92a64c5867ac45ef5e92e10483\``
        );
        await queryRunner.query(
            `DROP INDEX \`composite_idx_name\` ON \`master_sbu\``
        );
        await queryRunner.query(
            `DROP INDEX \`composite_idx_currencyCode\` ON \`master_currencies\``
        );
        await queryRunner.query(
            `DROP INDEX \`composite_idx_name_code\` ON \`master_business_sources\``
        );
        await queryRunner.query(
            `DROP INDEX \`composite_idx_name_short_code\` ON \`master_business_agents\``
        );
    }
}
