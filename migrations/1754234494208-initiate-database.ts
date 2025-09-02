import { MigrationInterface, QueryRunner } from "typeorm";

export class InitiateDatabase1754234494208 implements MigrationInterface {
    name = 'InitiateDatabase1754234494208'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_3e55c3ea1a7104e07694eef26b\` ON \`master_users\``);
        await queryRunner.query(`ALTER TABLE \`master_users\` DROP COLUMN \`short_code\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_users\` ADD \`short_code\` varchar(100) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_3e55c3ea1a7104e07694eef26b\` ON \`master_users\` (\`short_code\`)`);
    }

}
