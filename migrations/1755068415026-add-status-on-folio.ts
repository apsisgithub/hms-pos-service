import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusOnFolio1755068415026 implements MigrationInterface {
    name = 'AddStatusOnFolio1755068415026'

    public async up(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`master_folios\` ADD \`status\` enum ('Open', 'Closed', 'Cut') NOT NULL DEFAULT 'Open'`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       
        await queryRunner.query(`ALTER TABLE \`master_folios\` DROP COLUMN \`status\``);
        
    }

}
