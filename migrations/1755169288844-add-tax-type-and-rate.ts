import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTaxTypeAndRate1755169288844 implements MigrationInterface {
    name = 'AddTaxTypeAndRate1755169288844'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Add tax_type column
        await queryRunner.query(`
            ALTER TABLE \`master_taxes\` 
            ADD COLUMN \`tax_type\` enum('percentage', 'fixed') NOT NULL DEFAULT 'percentage'
        `);

        // Add tax_rate column
        await queryRunner.query(`
            ALTER TABLE \`master_taxes\` 
            ADD COLUMN \`tax_rate\` decimal(10,2) NOT NULL DEFAULT 0.00
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Remove tax_rate column
        await queryRunner.query(`
            ALTER TABLE \`master_taxes\` 
            DROP COLUMN \`tax_rate\`
        `);

        // Remove tax_type column
        await queryRunner.query(`
            ALTER TABLE \`master_taxes\` 
            DROP COLUMN \`tax_type\`
        `);
    }
}