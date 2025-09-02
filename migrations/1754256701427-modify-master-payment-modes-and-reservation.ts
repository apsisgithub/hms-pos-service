import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyMasterPaymentModesAndReservation1754256701427 implements MigrationInterface {
    name = 'ModifyMasterPaymentModesAndReservation1754256701427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` DROP COLUMN \`is_active\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_payment_modes\` ADD \`is_active\` tinyint NOT NULL DEFAULT '1'`);
    }

}
