import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCountryAndCityOnMasterSbu1754420369574 implements MigrationInterface {
    name = 'AddCountryAndCityOnMasterSbu1754420369574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_sbu\` ADD \`country\` varchar(10) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_sbu\` ADD \`city\` varchar(10) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_sbu\` DROP COLUMN \`city\``);
        await queryRunner.query(`ALTER TABLE \`master_sbu\` DROP COLUMN \`country\``);
    }

}
