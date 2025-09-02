import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSubTypeOnMasterChargesTable1755000298021 implements MigrationInterface {
    name = 'AddSubTypeOnMasterChargesTable1755000298021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TABLE \`master_charges\` ADD \`sub_type\` enum ('Late Checkout Charges', 'Cancellation Revenue', 'Day Use Charges', 'No Show Revenue', 'Room Charges') NULL`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`master_charges\` DROP COLUMN \`sub_type\``);
        
    }

}
