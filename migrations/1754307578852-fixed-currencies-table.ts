import { MigrationInterface, QueryRunner } from "typeorm";

export class FixedCurrenciesTable1754307578852 implements MigrationInterface {
    name = 'FixedCurrenciesTable1754307578852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`exchange_rate\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`is_active\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`symbol\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`country_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`currency_code\` varchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD UNIQUE INDEX \`IDX_85d85e6da9a4d701da80657414\` (\`currency_code\`)`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`sign\` varchar(10) NULL`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`is_sign_prefix\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`digits_after_decimal\` int NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`base_exchange_rate\` decimal(10,4) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`dollar_exchange_rate\` decimal(10,4) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`dollar_exchange_rate\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`base_exchange_rate\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`digits_after_decimal\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`is_sign_prefix\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`sign\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP INDEX \`IDX_85d85e6da9a4d701da80657414\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`currency_code\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` DROP COLUMN \`country_id\``);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`symbol\` varchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`name\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`is_active\` tinyint NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`exchange_rate\` decimal NOT NULL DEFAULT '1.0000'`);
        await queryRunner.query(`ALTER TABLE \`master_currencies\` ADD \`code\` varchar(5) NOT NULL`);
    }

}
