import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentRelatedTables1754606664798 implements MigrationInterface {
    name = 'AddPaymentRelatedTables1754606664798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP FOREIGN KEY \`FK_abdbc334c3ce63c07271111d6d2\``);
        await queryRunner.query(`CREATE TABLE \`master_payments\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`reservation_id\` int NULL, \`currency_id\` int NULL, \`credit_card_id\` int NULL, \`payment_mode_id\` int NOT NULL, \`paid_amount\` decimal(12,2) NOT NULL, \`paid_date\` date NULL, \`payment_status\` enum ('pending', 'paid', 'failed', 'refunded', 'partially_refunded', 'chargeback', 'expired', 'cancelled') NOT NULL DEFAULT 'paid', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP COLUMN \`charge_amount\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP COLUMN \`charge_date\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP COLUMN \`currency_id\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP FOREIGN KEY \`FK_740e3064a55a6136d46a9b8c011\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` CHANGE \`reservation_id\` \`reservation_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD CONSTRAINT \`FK_740e3064a55a6136d46a9b8c011\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_0aa01e20eca82efdd41c814f5ba\` FOREIGN KEY (\`payment_mode_id\`) REFERENCES \`master_payment_modes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_50af7cf119b0b6420b35f6755ce\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_4d0640f48c4fcd612132743f6bc\` FOREIGN KEY (\`currency_id\`) REFERENCES \`master_currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_payments\` ADD CONSTRAINT \`FK_84aff9385ee0d6305caaae03e09\` FOREIGN KEY (\`credit_card_id\`) REFERENCES \`master_credit_cards\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_84aff9385ee0d6305caaae03e09\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_4d0640f48c4fcd612132743f6bc\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_50af7cf119b0b6420b35f6755ce\``);
        await queryRunner.query(`ALTER TABLE \`master_payments\` DROP FOREIGN KEY \`FK_0aa01e20eca82efdd41c814f5ba\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` DROP FOREIGN KEY \`FK_740e3064a55a6136d46a9b8c011\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` CHANGE \`reservation_id\` \`reservation_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD CONSTRAINT \`FK_740e3064a55a6136d46a9b8c011\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD \`currency_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD \`charge_date\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD \`charge_amount\` decimal(12,2) NULL`);
        await queryRunner.query(`DROP TABLE \`master_payments\``);
        await queryRunner.query(`ALTER TABLE \`master_credit_cards\` ADD CONSTRAINT \`FK_abdbc334c3ce63c07271111d6d2\` FOREIGN KEY (\`currency_id\`) REFERENCES \`master_currencies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
