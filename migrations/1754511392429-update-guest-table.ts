import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGuestTable1754511392429 implements MigrationInterface {
    name = 'UpdateGuestTable1754511392429'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_GUEST_ALL_FULLTEXT\` ON \`master_guests\` (\`name\`, \`email\`, \`contact_no\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_GUEST_CONTACT_FULLTEXT\` ON \`master_guests\` (\`contact_no\`)`);
        await queryRunner.query(`CREATE FULLTEXT INDEX \`IDX_GUEST_EMAIL_FULLTEXT\` ON \`master_guests\` (\`email\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_GUEST_EMAIL_FULLTEXT\` ON \`master_guests\``);
        await queryRunner.query(`DROP INDEX \`IDX_GUEST_CONTACT_FULLTEXT\` ON \`master_guests\``);
        await queryRunner.query(`DROP INDEX \`IDX_GUEST_ALL_FULLTEXT\` ON \`master_guests\``);
    }

}
