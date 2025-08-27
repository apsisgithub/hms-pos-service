import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMasterGuest1754259435842 implements MigrationInterface {
    name = 'UpdateMasterGuest1754259435842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_guests\` CHANGE \`company_id\` \`title\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`master_guests\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`master_guests\` ADD \`title\` varchar(20) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_guests\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`master_guests\` ADD \`title\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`master_guests\` CHANGE \`title\` \`company_id\` int NULL`);
    }

}
