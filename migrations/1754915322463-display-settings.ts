import { MigrationInterface, QueryRunner } from "typeorm";

export class DisplaySettings1754915322463 implements MigrationInterface {
    name = "DisplaySettings1754915322463";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`arr_dept_date_format\` enum ('DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY') NOT NULL DEFAULT 'DD-MM-YYYY'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`round_off_type\` enum ('-1', '<>0', '1') NOT NULL DEFAULT '<>0'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`round_off_limit\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`add_up_round_off_to_rates\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`salutation\` enum ('Mr.', 'Ms.', 'Mrs.', 'Dr.') NOT NULL DEFAULT 'Mr.'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`identity_type\` enum ('NID', 'Passport', 'Driving License', 'Birth Certificate', 'Other') NOT NULL DEFAULT 'NID'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`default_reservation_type\` enum ('Confirm Booking', 'Tentative') NOT NULL DEFAULT 'Confirm Booking'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`bill_to\` enum ('Guest', 'Company', 'Agent') NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`state_caption\` varchar(100) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`zip_code_caption\` varchar(100) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`is_tax_inclusive_rates\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`web_rate_mode\` enum ('Regular', 'Allocated') NOT NULL DEFAULT 'Regular'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`web_room_inventory_mode\` enum ('Regular', 'Allocated') NOT NULL DEFAULT 'Regular'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`group_payment_posting_mode\` enum ('Group Owner', 'Room Distribution') NOT NULL DEFAULT 'Group Owner'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`registration_no_mandatory_for_travel_agent\` tinyint NOT NULL DEFAULT 0`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`payment_mode\` enum ('Cash/Bank', 'City Ledger') NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`payment_gateway\` enum ('Common PG', 'shift4') NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`timezone\` varchar(100) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`country\` varchar(100) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`nationality\` varchar(100) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_guests\` CHANGE \`purpose_of_visit\` \`purpose_of_visit\` enum ('Business & MICE', 'Event (Music, Festival, etc.)', 'Government/Diplomatic', 'Leisure or Special Occasion', 'Other (Medical, Transit, etc.)') NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`date_format\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`date_format\` enum ('DD-MM-YYYY', 'MM-DD-YYYY', 'YYYY-MM-DD', 'DD-MMM-YYYY') NOT NULL DEFAULT 'DD-MM-YYYY'`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`time_format\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`time_format\` enum ('HH:mm', 'hh:mm A') NOT NULL DEFAULT 'HH:mm'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`time_format\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`time_format\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`date_format\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` ADD \`date_format\` varchar(50) NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_guests\` CHANGE \`purpose_of_visit\` \`purpose_of_visit\` enum ('Business & MICE', 'Event (Musi', 'Festiva', 'etc.)', 'Government/Diplomatic', 'Leisure or Special Occasion', 'Other (Medica', 'Transi', 'etc.)') NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`nationality\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`country\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`timezone\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`payment_gateway\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`payment_mode\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`registration_no_mandatory_for_travel_agent\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`group_payment_posting_mode\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`web_room_inventory_mode\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`web_rate_mode\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`is_tax_inclusive_rates\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`zip_code_caption\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`state_caption\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`bill_to\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`default_reservation_type\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`identity_type\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`salutation\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`add_up_round_off_to_rates\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`round_off_limit\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`round_off_type\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_display_settings\` DROP COLUMN \`arr_dept_date_format\``
        );
    }
}
