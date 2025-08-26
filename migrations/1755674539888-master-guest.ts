import { MigrationInterface, QueryRunner } from "typeorm";

export class MasterGuest1755674539888 implements MigrationInterface {
    name = "MasterGuest1755674539888";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_guests\` CHANGE \`organization\` \`is_master_profile\` varchar(255) NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_guests\` CHANGE \`is_master_profile\` \`organization\` varchar(255) NULL`
        );
    }
}
