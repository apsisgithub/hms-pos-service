import { MigrationInterface, QueryRunner } from "typeorm";

export class InitiateDatabase1754235768844 implements MigrationInterface {
    name = 'InitiateDatabase1754235768844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_users\` CHANGE \`mobile_no\` \`mobile_no\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`master_users\` CHANGE \`contact_no\` \`contact_no\` varchar(50) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_users\` CHANGE \`contact_no\` \`contact_no\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`master_users\` CHANGE \`mobile_no\` \`mobile_no\` varchar(50) NOT NULL`);
    }

}
