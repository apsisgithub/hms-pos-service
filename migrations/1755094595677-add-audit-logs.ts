import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuditLogs1755094595677 implements MigrationInterface {
    name = 'AddAuditLogs1755094595677'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`audit_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`created_by\` int NULL, \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`updated_by\` int NULL, \`deleted_at\` timestamp(6) NULL, \`deleted_by\` int NULL, \`reservation_id\` int NOT NULL, \`sbu_id\` int NOT NULL, \`prev_title\` varchar(255) NULL, \`prev_description\` text NULL, \`after_title\` varchar(255) NOT NULL, \`after_description\` text NULL, \`ip_address\` varchar(45) NULL, \`operation_type\` varchar(100) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`DROP TABLE \`audit_logs\``);
    }

}
