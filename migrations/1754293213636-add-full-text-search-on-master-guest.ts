import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFullTextSearchOnMasterGuest1754293213636 implements MigrationInterface {
    name = 'AddFullTextSearchOnMasterGuest1754293213636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_GUEST_NAME_FULLTEXT\` ON \`master_guests\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_GUEST_NAME_FULLTEXT\` ON \`master_guests\``);
    }

}
