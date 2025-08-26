import { MigrationInterface, QueryRunner } from "typeorm";

export class Currency1755075701623 implements MigrationInterface {
    name = "Currency1755075701623";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`master_currency_exchange_rates\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`sbu_id\` int NOT NULL, \`country\` varchar(255) NOT NULL, \`currency_code\` varchar(255) NOT NULL, \`digits_after_decimal\` varchar(255) NOT NULL, \`base_exchange_rate\` float NOT NULL, \`dollar_exchange_rate\` float NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );

        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` ADD \`currency\` varchar(10) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_currencies\` DROP COLUMN \`currency\``
        );

        await queryRunner.query(
            `DROP TABLE \`master_currency_exchange_rates\``
        );
    }
}
