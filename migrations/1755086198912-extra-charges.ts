import { MigrationInterface, QueryRunner } from "typeorm";

export class ExtraCharges1755086198912 implements MigrationInterface {
    name = "ExtraCharges1755086198912";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`master_extra_charges\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`sbu_id\` int NOT NULL, \`short_code\` varchar(50) NOT NULL, \`name\` varchar(255) NOT NULL, \`rate\` enum ('Flat Percentage', 'Flat Amount') NOT NULL, \`front_desk_sort_key\` int NULL, \`is_fixed_price\` tinyint NOT NULL DEFAULT 0, \`rate_value\` float NULL, \`apply_on_offered_room_rent\` enum ('Net Rate', 'Sell Rate') NOT NULL, \`taxes\` text NULL, \`rate_inclusive_tax\` int NULL, \`publish_on_web\` tinyint NOT NULL DEFAULT 0, \`always_charge\` tinyint NOT NULL DEFAULT 0, \`voucher_no_type\` enum ('Auto - Private', 'Auto - General', 'Manual') NOT NULL, \`voucher_prefix\` varchar(50) NULL, \`voucher_start_from\` int NULL, \`web_applies_on\` varchar(255) NULL, \`web_posting_rule\` enum ('CheckIn and CheckOut', 'Everyday', 'Everyday except CheckIn', 'Only CheckIn', 'Only CheckOut') NULL, \`web_description\` text NULL, \`web_res_sort_key\` int NULL, \`web_valid_from\` date NULL, \`web_valid_to\` date NULL, \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );

        await queryRunner.query(
            `ALTER TABLE \`master_currency_exchange_rates\` ADD \`name\` varchar(255) NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_currency_exchange_rates\` DROP COLUMN \`name\``
        );

        await queryRunner.query(`DROP TABLE \`master_extra_charges\``);
    }
}
