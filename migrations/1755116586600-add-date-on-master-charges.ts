import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDateOnMasterCharges1755116586600 implements MigrationInterface {
    name = 'AddDateOnMasterCharges1755116586600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // First add the column as nullable
        await queryRunner.query(`ALTER TABLE \`master_charges\` ADD \`charge_date\` date NULL`);

        // Update existing rows with a default date (you can change this to a more appropriate date)
        await queryRunner.query(`UPDATE \`master_charges\` SET \`charge_date\` = CURDATE() WHERE \`charge_date\` IS NULL`);

        // Now make the column NOT NULL
        await queryRunner.query(`ALTER TABLE \`master_charges\` MODIFY \`charge_date\` date NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE \`master_charges\` DROP COLUMN \`charge_date\``);

    }

}
