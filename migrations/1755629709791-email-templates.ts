import { MigrationInterface, QueryRunner } from "typeorm";

export class EmailTemplates1755629709791 implements MigrationInterface {
    name = "EmailTemplates1755629709791";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE \`email_template_categories\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`name\` varchar(255) NOT NULL, \`description\` text NULL, \`sbu_id\` int NOT NULL, UNIQUE INDEX \`IDX_b6bb1f1d004e6d3f3cb38e40ee\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`template_placeholders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`source_module\` varchar(50) NOT NULL, \`source_table\` varchar(255) NOT NULL, \`source_column\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_2534d80327953769e928b51a55\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `CREATE TABLE \`template_placeholder_mappings\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`template_id\` int NOT NULL, \`placeholder_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` DROP COLUMN \`template_type\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` ADD \`template_used_for\` enum ('booking', 'invoice', 'marketing', 'other') NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` ADD \`category_id\` int NULL`
        );
        await queryRunner.query(
            `ALTER TABLE \`template_placeholder_mappings\` ADD CONSTRAINT \`FK_0a8a400646caeb5f21db88cc797\` FOREIGN KEY (\`template_id\`) REFERENCES \`master_email_templates\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`template_placeholder_mappings\` ADD CONSTRAINT \`FK_fabb560c83e91a3aabcd520c1a1\` FOREIGN KEY (\`placeholder_id\`) REFERENCES \`template_placeholders\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` ADD CONSTRAINT \`FK_0e43717f7833c6c6499a0b4ce09\` FOREIGN KEY (\`category_id\`) REFERENCES \`email_template_categories\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` DROP FOREIGN KEY \`FK_0e43717f7833c6c6499a0b4ce09\``
        );
        await queryRunner.query(
            `ALTER TABLE \`template_placeholder_mappings\` DROP FOREIGN KEY \`FK_fabb560c83e91a3aabcd520c1a1\``
        );
        await queryRunner.query(
            `ALTER TABLE \`template_placeholder_mappings\` DROP FOREIGN KEY \`FK_0a8a400646caeb5f21db88cc797\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` DROP COLUMN \`category_id\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` DROP COLUMN \`template_used_for\``
        );
        await queryRunner.query(
            `ALTER TABLE \`master_email_templates\` ADD \`template_type\` enum ('booking', 'invoice', 'marketing', 'other') NULL`
        );
        await queryRunner.query(`DROP TABLE \`template_placeholder_mappings\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_2534d80327953769e928b51a55\` ON \`template_placeholders\``
        );
        await queryRunner.query(`DROP TABLE \`template_placeholders\``);
        await queryRunner.query(
            `DROP INDEX \`IDX_b6bb1f1d004e6d3f3cb38e40ee\` ON \`email_template_categories\``
        );
        await queryRunner.query(`DROP TABLE \`email_template_categories\``);
    }
}
