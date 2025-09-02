import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentModesTable1754517034453 implements MigrationInterface {
    name = 'UpdatePaymentModesTable1754517034453'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` DROP FOREIGN KEY \`FK_a92a64c5867ac45ef5e92e10483\``);
        await queryRunner.query(`CREATE TABLE \`master_credit_cards\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`reservation_id\` int NOT NULL, \`card_number\` varchar(20) NOT NULL, \`card_holder_name\` varchar(100) NOT NULL, \`expiry_month\` int NOT NULL, \`expiry_year\` int NOT NULL, \`cvv\` int NOT NULL, \`card_type\` enum ('physical_card', 'virtual_card') NOT NULL, \`charge_amount\` decimal(12,2) NULL, \`charge_date\` date NULL, \`currency_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` DROP COLUMN \`sbu_id\``);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` DROP COLUMN \`type\``);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` DROP COLUMN \`details\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD CONSTRAINT \`FK_740e3064a55a6136d46a9b8c011\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD CONSTRAINT \`FK_abdbc334c3ce63c07271111d6d2\` FOREIGN KEY (\`currency_id\`) REFERENCES \`master_currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP FOREIGN KEY \`FK_abdbc334c3ce63c07271111d6d2\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP FOREIGN KEY \`FK_740e3064a55a6136d46a9b8c011\``);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` ADD \`details\` json NULL`);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` ADD \`type\` enum ('cash', 'card', 'online', 'other') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` ADD \`sbu_id\` int NOT NULL`);
        await queryRunner.query(`DROP TABLE \`master_credit_cards\``);
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` ADD CONSTRAINT \`FK_a92a64c5867ac45ef5e92e10483\` FOREIGN KEY (\`sbu_id\`) REFERENCES \`master_sbu\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
