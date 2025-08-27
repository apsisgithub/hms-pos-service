import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMasterFolioDiscount1755078496337 implements MigrationInterface {
    name = 'AddMasterFolioDiscount1755078496337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`master_folio_discounts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`discount_id\` int NOT NULL, \`discount_amount\` decimal(10,2) NOT NULL, \`folio_id\` int NOT NULL, \`description\` text NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        
        await queryRunner.query(`ALTER TABLE \`master_folio_discounts\` ADD CONSTRAINT \`FK_290d81a1ab3dd22f2045c49a2bf\` FOREIGN KEY (\`folio_id\`) REFERENCES \`master_folios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`master_folio_discounts\` DROP FOREIGN KEY \`FK_290d81a1ab3dd22f2045c49a2bf\``);
       
        await queryRunner.query(`DROP TABLE \`master_folio_discounts\``);
    }

}
