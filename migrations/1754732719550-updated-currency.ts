import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatedCurrency1754732719550 implements MigrationInterface {
    name = "UpdatedCurrency1754732719550";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` CHANGE \`country_id\` \`country\` int NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` DROP COLUMN \`country\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` ADD \`country\` varchar(255) NOT NULL`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX \`composite_idx_currencyCode\` ON \`master_currencies\` (\`currency_code\`, \`sbu_id\`, \`status\`, \`deleted_at\`)`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_payment_modes\` DROP FOREIGN KEY \`FK_a92a64c5867ac45ef5e92e10483\``
        );
        await queryRunner.query(
            `DROP INDEX \`composite_idx_currencyCode\` ON \`master_currencies\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` DROP COLUMN \`country\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` ADD \`country\` int NOT NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` CHANGE \`country\` \`country_id\` int NOT NULL`
        );
    }
}
