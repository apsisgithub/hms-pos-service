import { MigrationInterface, QueryRunner } from "typeorm";

export class SbuEntityAndReservationBillings1754490468000 implements MigrationInterface {
    name = 'SbuEntityAndReservationBillings1754490468000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`master_users\` ADD \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active'`);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` ADD CONSTRAINT \`FK_b2458caca02e023421658504452\` FOREIGN KEY (\`reservation_id\`) REFERENCES \`master_reservations\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` ADD CONSTRAINT \`FK_b5df971fccc8b065505074b5e89\` FOREIGN KEY (\`guest_id\`) REFERENCES \`master_guests\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` ADD CONSTRAINT \`FK_f6d25f8cb9c98e5d88886e5b80a\` FOREIGN KEY (\`payment_mode_id\`) REFERENCES \`master_payment_modes\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` ADD CONSTRAINT \`FK_d8fdc883b4da049dbbd80bacde7\` FOREIGN KEY (\`checkout_email_template_id\`) REFERENCES \`master_email_templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` DROP FOREIGN KEY \`FK_d8fdc883b4da049dbbd80bacde7\``);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` DROP FOREIGN KEY \`FK_f6d25f8cb9c98e5d88886e5b80a\``);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` DROP FOREIGN KEY \`FK_b5df971fccc8b065505074b5e89\``);
        await queryRunner.query(`ALTER TABLE \`master_reservation_billing_details\` DROP FOREIGN KEY \`FK_b2458caca02e023421658504452\``);
        await queryRunner.query(`ALTER TABLE \`master_users\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`master_users\` ADD \`status\` text NULL`);
    }

}
